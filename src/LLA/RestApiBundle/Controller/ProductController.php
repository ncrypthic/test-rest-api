<?php

namespace LLA\RestApiBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Request\ParamFetcher;
use LLA\RestApiBundle\Form\ProductType;
use LLA\RestApiBundle\Entity\Product;

/**
 * Product controller.
 *
 */
class ProductController extends FOSRestController
{
    /**
     * Get category products
     * 
     * @param Category $category
     * @Rest\QueryParam(name="sizes", requirements="[SMLX,]+", nullable=true)
     * @Rest\QueryParam(name="colors", requirements="[0-9\.]+", nullable=true)
     * @Rest\QueryParam(name="min", requirements="[0-9]+", nullable=true)
     * @Rest\QueryParam(name="max", requirements="[0-9]+", nullable=true)
     * @Rest\QueryParam(name="limit", requirements="[0-9]+", nullable=true, default=10)
     * @Rest\QueryParam(name="offset", requirements="[0-9]+", nullable=true, default=0)
     * @Rest\View(serializerGroups={"product"})
     * @todo Implement pagination
     * 
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCategoryProductsAction($category_id, ParamFetcher $fetcher)
    {
        $em = $this->getDoctrine()->getManager();
        $categoryRepo = $em->getRepository("LLARestApiBundle:Category");
        $category = $categoryRepo->find($category_id);
        $sizes    = array();
        $colors   = array();
        $minPrice = 0;$maxPrice = 99999999;
        $limit    = $fetcher->get('limit');
        $offset   = $fetcher->get('offset');
        if($fetcher->get('sizes')) {
            $sizes = explode(',', $fetcher->get('sizes'));
        }
        if($fetcher->get("colors")) {
            $colors = explode(",", $fetcher->get("colors"));
        }
        if($fetcher->get("min") > 0) {
            $minPrice = $fetcher->get("min");
        }
        if($fetcher->get("max") > 0) {
            $maxPrice = $fetcher->get("max");
        }
        
        return $em->getRepository('LLARestApiBundle:Product')
                ->findByFilter($category, $sizes, $colors, $minPrice, $maxPrice,
                        $limit, $offset);
    }
    
    /**
     * Get products
     * 
     * @Rest\QueryParam(name="sizes", requirements="[SMLX,]+", nullable=true)
     * @Rest\QueryParam(name="colors", requirements="[a-zA-Z0-9\.,\#]+", nullable=true)
     * @Rest\QueryParam(name="min", requirements="[0-9]+", nullable=true)
     * @Rest\QueryParam(name="max", requirements="[0-9]+", nullable=true)
     * @Rest\QueryParam(name="limit", requirements="[0-9]+", nullable=true, default=10)
     * @Rest\QueryParam(name="offset", requirements="[0-9]+", nullable=true, default=0)
     * @Rest\View(serializerGroups={"product"})
     * 
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getProductsAction(ParamFetcher $fetcher)
    {
        $em = $this->getDoctrine()->getManager();
        $sizes  = array();
        $colors = array();
        $minPrice = 0;$maxPrice = 99999999;
        $limit    = $fetcher->get('limit');
        $offset   = $fetcher->get('offset');
        if($fetcher->get('sizes')) {
            $sizes = explode(',', $fetcher->get('sizes'));
        }
        if($fetcher->get("colors")) {
            $colors = explode(",", $fetcher->get("colors"));
        }
        if($fetcher->get("min") > 0) {
            $minPrice = $fetcher->get("min");
        }
        if($fetcher->get("max") > 0) {
            $maxPrice = $fetcher->get("max");
        }

        return $em->getRepository('LLARestApiBundle:Product')
                ->findByFilter(null, $sizes, $colors, $minPrice, $maxPrice,
                        $limit, $offset);
    }
    
    /**
     * Get single product
     * 
     * @Rest\View(serializerGroups={"product"})
     * 
     * @return \LLA\RestApiBundle\Entity\Product
     */
    public function getProductAction($product_id) 
    {
        $em = $this->getDoctrine()->getManager();
        
        $product = $em->getRepository('LLARestApiBundle:Product')
                       ->find($product_id);
        if(!$product) {
            throw new NotFoundHttpException('category');
        }
        
        return $product;
    }
    
    /**
     * Create product
     * 
     * @Rest\View(serializerGroups={"product"})
     */
    public function postProductAction(Request $req) 
    {
        $om   = $this->getDoctrine()->getManager();
        $type = new ProductType($om);
        $form = $this->createFormBuilder(new Product())->create('', $type)->getForm();
        $form->handleRequest($req);
        if($form->isValid()) {
            $product = $form->getData();
            $product->setCreatedAt(new \DateTime());
            $product->setCreatedBy("SYSTEM");
            
            $om->persist($product);
            $om->flush();
            
            return $product;
        }
        
        return $form;
    }
    
    /**
     * Delete a product
     * 
     * @param string $product_id
     * @Rest\View(statusCode=204)
     */
    public function deleteProductAction($product_id)
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('LLARestApiBundle:Product');
        $product = $repo->find($product_id);
        $em->remove($product);
        $em->flush();
    }
}
