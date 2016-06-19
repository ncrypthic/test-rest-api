<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace LLA\RestApiBundle\Repository;

use LLA\RestApiBundle\Entity\Category;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\EntityRepository;

/**
 * Description of ProductRepository
 *
 * @author Lim Afriyadi <lim.afriyadi@rajawalisoftware.com>
 */
class ProductRepository extends EntityRepository
{
    public function findByFilter(Category $category = null, 
            array $sizes = array(), array $colors = array(), 
            $minPrice = 0, $maxPrice = 0, $limit = 10, $offset = 0)
    {
        $qb = $this->createQueryBuilder('product');
        $this->filterCategory($qb, $category)
            ->filterSize($qb, $sizes)
            ->filterColors($qb, $colors)
            ->filterPrice($qb, $minPrice, $maxPrice);
        
        return $qb->getQuery()->getResult();
    }
    
    private function filterCategory(QueryBuilder $builder, Category $category = null) 
    {
        if($category) {
            $builder->andWhere("product.category = :category")
                    ->setParameter("category", $category);
        }
        
        return $this;
    }
    
    private function filterSize(QueryBuilder $builder, array $sizes)
    {
        if(count($sizes) > 0) {
            $builder->andWhere($builder->expr()->in("product.size", $sizes));
        }
        
        return $this;
    }
    
    private function filterColors(QueryBuilder $builder, array $colors)
    {
        if(count($colors) > 0) {
            $builder->andWhere($builder->expr()->in("product.color", $colors));
        }
        
        return $this;
    }
    
    private function filterPrice(QueryBuilder $builder, $minPrice = 0, $maxPrice = 99999999)
    {
        if($minPrice < $maxPrice) {
            $builder->andWhere("product.price between :minPrice and :maxPrice")
                    ->setParameter("minPrice", $minPrice)
                    ->setParameter("maxPrice", $maxPrice);
        } elseif ($maxPrice < $minPrice) {
            $builder->andWhere("product.price between :minPrice and :maxPrice")
                    ->setParameter("minPrice", $maxPrice)
                    ->setParameter("maxPrice", $minPrice);
        }
        
        return $this;
    }
}