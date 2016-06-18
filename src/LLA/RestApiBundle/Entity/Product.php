<?php

namespace LLA\RestApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

/**
 * Product
 *
 * @ORM\Table(name="tbl_product", indexes={@ORM\Index(name="fk_product_category_idx", columns={"category_id"})})
 * @ORM\Entity(repositoryClass="LLA\RestApiBundle\Repository\ProductRepository")
 */
class Product
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @Serializer\Groups({"product"})
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     * @Serializer\Groups({"product"})
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="size", type="string", length=20, nullable=false)
     * @Serializer\Groups({"product"})
     */
    private $size;
    
    /**
     * @var float
     *
     * @ORM\Column(name="price", type="decimal", length=20, scale=2, nullable=false)
     * @Serializer\Groups({"product"})
     */
    private $price;
    
    /**
     *
     * @var string
     * @ORM\Column(name="color", type="string", length=64)
     * @Serializer\Groups({"product"})
     */
    private $color;

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
     * @var Category
     * 
     * @ORM\ManyToOne(targetEntity="Category")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="category_id", referencedColumnName="id")
     * })
     * @Serializer\Groups({"product"})
     */
    private $category;
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Product
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set size
     *
     * @param string $size
     * @return Product
     */
    public function setSize($size)
    {
        $this->size = $size;

        return $this;
    }

    /**
     * Get size
     *
     * @return string 
     */
    public function getSize()
    {
        return $this->size;
    }
    
    /**
     * Set product price
     * 
     * @param float $price
     * @return \LLA\RestApiBundle\Entity\Product
     */
    public function setPrice($price)
    {
        $this->price = (float) $price;
        
        return $this;
    }
    
    /**
     * Get product price
     * 
     * @return float
     */
    public function getPrice()
    {
        return $this->price;
    }
    
    /**
     * Set product color
     * 
     * @param string $color
     * @return \LLA\RestApiBundle\Entity\Product
     */
    public function setColor($color)
    {
        $this->color = $color;
        
        return $this;
    }
    
    /**
     * Get product color
     * 
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Product
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set createdBy
     *
     * @param string $createdBy
     * @return Product
     */
    public function setCreatedBy($createdBy)
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return string 
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return Product
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime 
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set updatedBy
     *
     * @param string $updatedBy
     * @return Product
     */
    public function setUpdatedBy($updatedBy)
    {
        $this->updatedBy = $updatedBy;

        return $this;
    }

    /**
     * Get updatedBy
     *
     * @return string 
     */
    public function getUpdatedBy()
    {
        return $this->updatedBy;
    }

    /**
     * Set product category
     * 
     * @param \LLA\RestApiBundle\Entity\Category $category
     * @return \LLA\RestApiBundle\Entity\Product
     */
    public function setCategory(Category $category)
    {
        $this->category = $category;
        
        return $this;
    }
    
    /**
     * Get product category
     * 
     * @return Category
     */
    public function getCategory()
    {
        return $this->category;
    }
}
