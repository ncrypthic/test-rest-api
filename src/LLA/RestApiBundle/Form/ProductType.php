<?php

namespace LLA\RestApiBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use FOS\RestBundle\Form\Transformer\EntityToIdObjectTransformer;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityRepository;

class ProductType extends AbstractType
{
    /**
     * @var ObjectManager
     */
    private $manager;
    
    public function __construct(ObjectManager $manager)
    {
        $this->manager = $manager;
    }
    
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $transformer = new EntityToIdObjectTransformer($this->manager, 
                            'LLARestApiBundle:Category');
        $sizes = array( 
            'S'    => 'S',
            'M'    => 'M',
            'L'    => 'L',
            'XL'   => 'XL',
            'XXL'  => 'XXL',
            'XXXL' => 'XXXL'
        );
        $builder
            ->add('name', 'text', array('required' => true))
            ->add('size', 'choice', array(
                'required' => true, 
                'choices'  => $sizes
            ))
            ->add('color', 'text', array(
                'required' => true
            ))
            ->add('price', 'number', array(
                'required' => true
            ))
            ->add($builder->create('category', 'text')->addModelTransformer($transformer))
        ;
    }
    
    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'LLA\RestApiBundle\Entity\Product'
        ));
    }
}
