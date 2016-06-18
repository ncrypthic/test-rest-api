<?php

namespace LLA\RestApiBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use FOS\RestBundle\Form\Transformer\EntityToIdObjectTransformer;
use Doctrine\Common\Persistence\ObjectManager;

class CategoryType extends AbstractType
{
    /**
     * @var ObjectManager
     */
    private $om;
    
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $transformer = new EntityToIdObjectTransformer($this->om, 
                            'LLARestApiBundle:Category');
        $builder
            ->add('name', 'text', array( 'required' => true ))
            ->add(
                $builder
                    ->create('parent', 'text')
                    ->addModelTransformer($transformer)
            )
        ;
    }
    
    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'LLA\RestApiBundle\Entity\Category'
        ));
    }
}
