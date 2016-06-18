<?php

namespace LLA\RestApiBundle\Controller;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations as Rest;
use LLA\RestApiBundle\Entity\Category;
use LLA\RestApiBundle\Form\CategoryType;

/**
 * Worksite controller.
 *
 */
class CategoryController extends FOSRestController
{
    /**
     * Get product categories
     * 
     * @todo Implement pagination
     * 
     * @Rest\View(serializerGroups={"category"}, serializerEnableMaxDepthChecks=true)
     * 
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCategoriesAction()
    {
        $em = $this->getDoctrine()->getManager();

        return $em->getRepository('LLARestApiBundle:Category')
                ->childrenHierarchy(null, true);
    }
    
    /**
     * Get single product category
     * 
     * @Rest\View(serializerGroups={"category_detail"}, serializerEnableMaxDepthChecks=true)
     * 
     * @return \LLA\RestApiBundle\Entity\Category
     */
    public function getCategoryAction($category_id) 
    {
        $em = $this->getDoctrine()->getManager();
        
        $category = $em->getRepository('LLARestApiBundle:Category')
                ->find($category_id);
        if(!$category) {
            throw new NotFoundHttpException('category');
        }
        
        return $category;
    }
    
    /**
     * Create new category
     * 
     * @Rest\View(serializerGroups={"category"})
     */
    public function postCategoryAction(Request $req) 
    {
        $om   = $this->getDoctrine()->getManager();
        $type = new CategoryType($om);
        $form = $this->createFormBuilder(new Category())->create('', $type)->getForm();
        $form->handleRequest($req);
        if($form->isValid()) {
            /* @var $category Category */
            $category = $form->getData();
            $category->setCreatedAt(new \DateTime());
            $category->setCreatedBy("SYSTEM");
            $om->persist($category);
            $om->flush();
            
            return $category;
        }
        
        return $form;
    }
    
    /**
     * Delete category id
     * 
     * @param integer $category_id
     * @Rest\View(statusCode=204)
     */
    public function deleteCategoryAction($category_id)
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('LLA\RestApiBundle\Entity\Category');
        $category = $repo->find($category_id);
        $repo->removeFromTree($category);
        $em->clear($category);
        $em->remove($category);
        $em->flush();
    }
}
