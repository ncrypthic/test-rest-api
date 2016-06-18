<?php

namespace LLA\RestApiBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use JMS\Serializer\Annotation as Serializer;

/**
 * Category
 *
 * @Gedmo\Tree(type="nested")
 * @ORM\Table(name="tbl_category")
 * @ORM\Entity(repositoryClass="LLA\RestApiBundle\Repository\CategoryRepository")
 * @todo Rename `name` field to `label` for frontend integration
 */
class Category {

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @Serializer\Groups({"category_detail", "category", "product", "product_detail"})
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     * @Serializer\Groups({"category_detail","category", "product", "product_detail"})
     */
    private $name;
    
    /**
     * @var integer
     * 
     * @Gedmo\TreeLeft
     * @ORM\Column(name="lft", type="integer")
     * @Serializer\Groups({})
     */
    private $lft;
    
    /**
     * @var integer
     * 
     * @Gedmo\TreeLevel
     * @ORM\Column(type="integer")
     * @Serializer\Exclude
     */
    private $lvl;
    
    /**
     * @var integer
     * 
     * @Gedmo\TreeRight
     * @ORM\Column(name="rgt", type="integer")
     * @Serializer\Groups({"category"})
     * @Serializer\Exclude
     */
    private $rgt;
    
    /**
     * @var Category
     * 
     * @Gedmo\TreeRoot
     * @ORM\ManyToOne(targetEntity="Category")
     * @ORM\JoinColumn(referencedColumnName="id", onDelete="CASCADE")
     * @Serializer\Groups({"category_detail"})
     * @Serializer\MaxDepth(1)
     */
    private $root;

    /**
     * @var Category
     * 
     * @Gedmo\TreeParent
     * @ORM\ManyToOne(targetEntity="Category", inversedBy="children")
     * @ORM\JoinColumn(referencedColumnName="id", onDelete="CASCADE")
     * @Serializer\Groups({"category_detail"})
     * @Serializer\MaxDepth(1)
     */
    private $parent;

    /**
     * @var Category[]
     * 
     * @ORM\OneToMany(targetEntity="Category", mappedBy="parent")
     * @ORM\OrderBy({"lft" = "ASC"})
     * @Serializer\Groups({"category", "category_detail"})
     */
    private $children;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false)
     */
    private $createdAt;

    /**
     * @var string
     *
     * @ORM\Column(name="created_by", type="string", length=255, nullable=false)
     */
    private $createdBy;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @var string
     *
     * @ORM\Column(name="updated_by", type="string", length=255, nullable=true)
     */
    private $updatedBy;

    /**
     *
     * @var Product[]
     * @ORM\OneToMany(targetEntity="Product", mappedBy="category")
     * @ORM\JoinColumns({
     *    @ORM\JoinColumn(name="id", referencedColumnName="category_id")
     * })
     */
    private $products;

    public function __construct() {
        $this->products = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Category
     */
    public function setName($name) {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName() {
        return $this->name;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Category
     */
    public function setCreatedAt($createdAt) {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime 
     */
    public function getCreatedAt() {
        return $this->createdAt;
    }

    /**
     * Set createdBy
     *
     * @param string $createdBy
     * @return Category
     */
    public function setCreatedBy($createdBy) {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return string 
     */
    public function getCreatedBy() {
        return $this->createdBy;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return Category
     */
    public function setUpdatedAt($updatedAt) {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime 
     */
    public function getUpdatedAt() {
        return $this->updatedAt;
    }

    /**
     * Set updatedBy
     *
     * @param string $updatedBy
     * @return Category
     */
    public function setUpdatedBy($updatedBy) {
        $this->updatedBy = $updatedBy;

        return $this;
    }

    /**
     * Get updatedBy
     *
     * @return string 
     */
    public function getUpdatedBy() {
        return $this->updatedBy;
    }

    /**
     * Add product
     * 
     * @param \LLA\RestApiBundle\Entity\Product $product
     * @return \LLA\RestApiBundle\Entity\Category
     */
    public function addProperty(Product $product) 
    {
        $this->products->addElement($product);
        
        return $this;
    }

    /**
     * Remove product
     * 
     * @param \LLA\RestApiBundle\Entity\Product $product
     */
    public function removeProduct(Product $product) 
    {
        $this->products->removeElement($product);
    }

    /**
     * Get products
     * 
     * @return Products[]
     */
    public function getProducts() 
    {
        return $this->products;
    }
    
    /**
     * Set left value
     * 
     * @param integer $lft
     * @return \LLA\RestApiBundle\Entity\Category
     */
    public function setLeftValue($lft)
    {
        $this->lft = $lft;
        
        return $this;
    }
    
    /**
     * Get left value
     * 
     * @return integer
     */
    public function getLeftValue()
    {
        return $this->lft;
    }
    
    /**
     * Set level
     * 
     * @param integer $lvl
     * @return \LLA\RestApiBundle\Entity\Category
     */
    public function setLevel($lvl)
    {
        $this->lvl = $lvl;
        
        return $this;
    }
    
    /**
     * Get level
     * 
     * @return integer
     */
    public function getLevel()
    {
        return $this->lvl;
    }
    
    /**
     * Set right value
     * 
     * @param integer $rgt
     * @return \LLA\RestApiBundle\Entity\Category
     */
    public function setRightValue($rgt)
    {
        $this->rgt = $rgt;
        
        return $this;
    }
    
    /**
     * Get right value
     * 
     * @return integer
     */
    public function getRightValue()
    {
        return $this->rgt;
    }
    
    /**
     * Get root
     * 
     * @return Category
     */
    public function getRoot()
    {
        return $this->root;
    }

    /**
     * Set parent category
     * 
     * @param \LLA\RestApiBundle\Entity\Category $parent
     * @return \LLA\RestApiBundle\Entity\Category
     */
    public function setParent(Category $parent = null)
    {
        $this->parent = $parent;
        return $this;
    }

    /**
     * Get parent category
     * 
     * @return Category
     */
    public function getParent()
    {
        return $this->parent;
    }
}
