<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace LLA\RestApiBundle\Repository;

use LLA\RestApiBundle\Entity\Category;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\EntityRepository;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

/**
 * Description of ProductRepository
 *
 * @author Lim Afriyadi <lim.afriyadi@rajawalisoftware.com>
 */
class CategoryRepository extends NestedTreeRepository
{
    /**
     * This index is used to hold the children of a node
     * when using any of the buildTree related methods.
     *
     * @var string
     */
    protected $childrenIndex = 'children';
    
    public function getNodesHierarchy($node = null, $direct = false, array $options = array(), $includeNode = false)
    {
        return $this->getNodesHierarchyQuery($node, $direct, $options, $includeNode)->getResult();
    }
    
    /**
     * {@inheritDoc}
     */
    public function childrenHierarchy($node = null, $direct = false, array $options = array(), $includeNode = false)
    {
        $meta = $this->getClassMetadata();

        if ($node !== null) {
            if ($node instanceof $meta->name) {
                $wrapperClass = $this->om instanceof \Doctrine\ORM\EntityManager ?
                    '\Gedmo\Tool\Wrapper\EntityWrapper' :
                    '\Gedmo\Tool\Wrapper\MongoDocumentWrapper';
                $wrapped = new $wrapperClass($node, $this->om);
                if (!$wrapped->hasValidIdentifier()) {
                    throw new InvalidArgumentException("Node is not managed by UnitOfWork");
                }
            }
        } else {
            $includeNode = true;
        }

        // Gets the array of $node results. It must be ordered by depth
        $nodes = $this->getNodesHierarchy($node, true, $options, $includeNode);

        return $this->buildTreeArray($nodes, $options);
    }
    
    /**
     * @see \Gedmo\Tree\RepositoryUtilsInterface::buildTree
     */
    public function buildCollectionTree(array $nodes, array $options = array())
    {
        $meta = $this->getClassMetadata();
        $nestedTree = $this->buildTreeFromCollection($nodes);

        $default = array(
            'decorate' => false,
            'rootOpen' => '<ul>',
            'rootClose' => '</ul>',
            'childOpen' => '<li>',
            'childClose' => '</li>',
            'nodeDecorator' => function ($node) use ($meta) {
                // override and change it, guessing which field to use
                if ($meta->hasField('title')) {
                    $field = 'title';
                } elseif ($meta->hasField('name')) {
                    $field = 'name';
                } else {
                    throw new InvalidArgumentException("Cannot find any representation field");
                }

                return $node[$field];
            },
        );
        $options = array_merge($default, $options);
        // If you don't want any html output it will return the nested array
        if (!$options['decorate']) {
            return $nestedTree;
        }

        if (!count($nestedTree)) {
            return '';
        }

        $childrenIndex = $this->childrenIndex;

        $build = function ($tree) use (&$build, &$options, $childrenIndex) {
            $output = is_string($options['rootOpen']) ? $options['rootOpen'] : $options['rootOpen']($tree);
            foreach ($tree as $node) {
                $output .= is_string($options['childOpen']) ? $options['childOpen'] : $options['childOpen']($node);
                $output .= $options['nodeDecorator']($node);
                if (count($node[$childrenIndex]) > 0) {
                    $output .= $build($node[$childrenIndex]);
                }
                $output .= is_string($options['childClose']) ? $options['childClose'] : $options['childClose']($node);
            }

            return $output.(is_string($options['rootClose']) ? $options['rootClose'] : $options['rootClose']($tree));
        };

        return $build($nestedTree);
    }
    
    /**
     * {@inheritDoc}
     */
    public function buildTreeArray(array $nodes)
    {
        $meta = $this->getClassMetadata();
        $config = $this->listener->getConfiguration($this->_em, $meta->name);
        $nestedTree = array();
        $l = 0;

        if (count($nodes) > 0) {
            // Node Stack. Used to help building the hierarchy
            $stack = array();
            
            foreach ($nodes as $child) {
                /* @var $item Category */
                $item = $child;
                // Number of stack items
                $l = count($stack);
                // Check if we're dealing with different levels
                while ($l > 0 && $stack[$l - 1]->getLevel() >= $item->getLevel()) {
                    array_pop($stack);
                    $l--;
                }
                // Stack is empty (we are inspecting the root)
                if ($l == 0) {
                    // Assigning the root child
                    $i = count($nestedTree);
                    $nestedTree[$i] = $item;
                    $stack[] = &$nestedTree[$i];
                } else {
                    // Add child to parent
                    $i = count($stack[$l - 1][$this->childrenIndex]);
                    $stack[$l - 1][$this->childrenIndex][$i] = $item;
                    $stack[] = &$stack[$l - 1][$this->childrenIndex][$i];
                }
            }
        }

        return $nestedTree;
    }
}