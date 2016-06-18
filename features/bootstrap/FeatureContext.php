<?php

use Behat\Behat\Tester\Exception\PendingException;
use Behat\Behat\Context\Context;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Symfony\Component\HttpKernel\HttpKernel;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Doctrine\ORM\EntityManager;
use LLA\RestApiBundle\Entity\Category;
use PHPUnit_Framework_Assert as Test;
use LLA\RestApiBundle\Entity\Product;

/**
 * Defines application features from the specific context.
 */
class FeatureContext implements Context, SnippetAcceptingContext
{
    /**
     * @var Request
     */
    private $request;

    /**
     * @var HttpKernel
     */
    private $kernel;
    
    /**
     * @var Response
     */
    private $response;
    
    /**
     * @var EntityManager;
     */
    private $em;
    
    /**
     * @var Router
     */
    private $router;
    
    /**
     * @var array
     */
    private $productFilter;
    
    /**
     * @var snumber
     */
    private static $lastInsertId;

    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct(HttpKernel $kernel, EntityManager $manager, Router $router)
    {
        $this->kernel = $kernel;
        $this->em     = $manager;
        $this->router = $router;
        $this->productFilter = array();
    }

    /**
     * @When I send the request
     */
    public function iSendTheRequest()
    {
        $this->userSendTheRequest();
    }

    /**
     * @Then the response is JSON
     */
    public function theResponseIsJson()
    {
        $type = $this->response->headers->get("Content-Type");
        Test::assertTrue(stripos($type, "json") >= 0);
        Test::assertJson($this->response->getContent());
    }

    /**
     * @Then the response has an :arg1 property
     */
    public function theResponseHasAnProperty($arg1)
    {
        $data = json_decode($this->response->getContent(), true);
        Test::assertArrayHasKey($arg1, $data);
    }

    /**
     * @Then that the :arg1 is a number
     */
    public function thatTheIsANumber($arg1)
    {
        $data = json_decode($this->response->getContent(), true);
        Test::assertArrayHasKey($arg1, $data);
        Test::assertTrue(is_int($data[$arg1]));
        static::$lastInsertId = $data['id'];
    }

    /**
     * @Given that I want to get a category that was created
     */
    public function thatIWantToGetACategoryThatWasCreated()
    {
        $url = $this->router->generate("get_category", array(
            "category_id" => static::$lastInsertId,
            "_format" => "json"
        ));
        $this->request = Request::create($url);
    }
    
    /**
     * @Then that :arg1 property value is :arg2
     */
    public function thatPropertyValueIs($arg1, $arg2)
    {
        $data = json_decode($this->response->getContent(), true);
        Test::assertEquals($arg2, $data[$arg1]);
    }

    /**
     * @Given that I want to get list of product categories
     */
    public function thatIWantToGetListOfProductCategories()
    {
        $url = $this->router->generate("get_categories", 
                array('_format' => 'json'));
        $this->request = Request::create($url);
    }

    /**
     * @Given I am a valid api subscriber
     */
    public function iAmAValidApiSubscriber()
    {
        
    }

    /**
     * @Then the response contains tree of product categories
     */
    public function theResponseContainsTreeOfProductCategories()
    {
        $data = json_decode($this->response->getContent(), true);
        Test::assertArrayHasKey(0, $data);
        if(count($data[0]['children']) > 0) {
            Test::assertArrayHasKey("id", $data[0]['children'][0]);
        }
    }

    /**
     * @Given that I want to create a category with name :arg1 as a sub category of :arg2
     */
    public function thatIWantToCreateACategoryWithNameAsASubCategoryOf($arg1, $arg2)
    {
        $data = new \stdClass();
        $data->name = $arg1;
        $categoryRepo = $this->em->getRepository("LLARestApiBundle:Category");
        $parent       = $categoryRepo->findOneByName($arg2);
        Test::assertTrue($parent instanceof Category);
        $data->parent = new \stdClass();
        $data->parent->id   = $parent->getId();
        $data->parent->name = $parent->getName();
        $payload = json_encode($data);
        $url = $this->router->generate('post_category', array(
            '_format' => 'json'
        ));
        $this->request = Request::create($url, Request::METHOD_POST, array(),
                            array(), array(), array(), $payload);
        $this->request->headers->set("Content-Type", "application/json");
    }

    /**
     * @Then if the :arg1 property is not empty it should have an :arg2 property
     */
    public function ifThePropertyIsNotEmptyItShouldHaveAnProperty($arg1, $arg2)
    {
        $data = json_decode($this->response->getContent(), true);
        if(isset($data[$arg1])) {
            Test::assertArrayHasKey($arg2, $data['parent']);
        }
    }

    /**
     * @Given that I want to delete product category that was created
     */
    public function thatIWantToDeleteProductCategoryThatWasCreated()
    {
        echo static::$lastInsertId;
        $url = $this->router->generate("delete_category", array(
            "_format" => "json", "category_id" => static::$lastInsertId));
        $this->request = Request::create($url, Request::METHOD_DELETE);
    }

    /**
     * @Then try to find deleted category
     */
    public function tryToFindDeletedCategory()
    {
        $url = $this->router->generate("get_category", array(
            "_format"=>"json", "category_id" => static::$lastInsertId));
        $this->request = Request::create($url);
    }

    /**
     * @Then the response is not found
     */
    public function theResponseIsNotFound()
    {
        Test::assertEquals(404, $this->response->getStatusCode());
    }

    /**
     * @Given that user want to create a product under category :arg1
     */
    public function thatUserWantToCreateAProductUnderCategory($arg1)
    {
        $categoryRepo = $this->em->getRepository("LLARestApiBundle:Category");
        $category = $categoryRepo->findByName($arg1)[0];
        $data = new \stdClass();
        $data->name = "Product 1";
        $data->price = 75000;
        $data->size  = "M";
        $data->color = "black";
        $data->category = new \stdClass();
        $data->category->id = $category->getId();
        $data->category->name = $category->getName();
        $payload = json_encode($data);
        $url = $this->router->generate('post_product', array("_format"=>"json"));
        $this->request = Request::create($url, Request::METHOD_POST, array(), 
                array(), array(), array(), $payload);
        $this->request->headers->set("Content-Type", "application/json");
    }

    /**
     * @Given user is a valid api subscriber
     */
    public function userIsAValidApiSubscriber()
    {
        
    }

    /**
     * @When user send the request
     */
    public function userSendTheRequest()
    {
        echo $this->request->getMethod()." | ".$this->request->getUri();
        $this->response = $this->kernel->handle($this->request);
    }

    /**
     * @Given that user to get a product that was created
     */
    public function thatUserToGetAProductThatWasCreated()
    {
        $url = $this->router->generate("get_product", array("_format"=>"json", 
            "product_id"=>static::$lastInsertId));
        $this->request = Request::create($url);
    }
    
    /**
     * @Given that user to get list of all products
     */
    public function thatUserToGetListOfAllProducts()
    {
        $url = $this->router->generate("get_products", array("_format"=>"json"));
        $this->request = Request::create($url);
    }

    /**
     * @Given that user to get list of product under specific category :arg1
     */
    public function thatUserToGetListOfProductUnderSpecificCategory($arg1)
    {
        $categoryRepo = $this->em->getRepository("LLARestApiBundle:Category");
        $category = $categoryRepo->findByName($arg1)[0];
        $url = $this->router->generate("get_category_products", array("_format"=>"json", 
            "category_id" => $category->getId()));
        $this->request = Request::create($uri);
    }

    /**
     * @Then the response list all product
     */
    public function theResponseListAllProduct()
    {
        $data = json_decode($this->response->getContent(), true);
        Test::assertTrue(is_array($data));
    }

    /**
     * @Given that user to get list of products under specific category :arg1
     */
    public function thatUserToGetListOfProductsUnderSpecificCategory($arg1)
    {
        $categoryRepo = $this->em->getRepository("LLARestApiBundle:Category");
        $category = $categoryRepo->findByName($arg1)[0];
        $url = $this->router->generate("get_category_products", array(
            "_format" => "json",
            "category_id" => $category->getId()
        ));
        $this->request = Request::create($url);
    }

    /**
     * @Then the response contains list of products under category :arg1
     */
    public function theResponseContainsListOfProductsUnderSpecifiedCategories($arg1)
    {
        $data = json_decode($this->response->getContent(), true);
        foreach($data as $product) {
            Test::assertEquals($product['category']['name'], $arg1);
        }
    }

    /**
     * @Given that user delete a product that was created
     */
    public function thatUserDeleteAProductThatWasCreated()
    {
        $url = $this->router->generate("delete_product", array("_format" => "json",
                "product_id" => static::$lastInsertId));
        $this->request = Request::create($url, Request::METHOD_DELETE);
    }

    /**
     * @Then try to find deleted product
     */
    public function tryToFindDeletedProduct()
    {
        $url = $this->router->generate("get_product", array("_format" => "json",
                "product_id" => static::$lastInsertId));
        $this->request = Request::create($url);
    }

    /**
     * @Given that user to get list of products under category :arg1
     */
    public function thatUserToGetListOfProductsUnderCategory($arg1)
    {
        $categoryRepo = $this->em->getRepository("LLARestApiBundle:Category");
        $category = $categoryRepo->findByName($arg1)[0];
        $url = $this->generate("get_category_products", array("_format" => "json",
            "category_id" => $category->getId()));
        $this->request = Request::create($url);
    }

    /**
     * @Given the user is a valid api subscriber
     */
    public function theUserIsAValidApiSubscriber()
    {
        
    }

    /**
     * @When the user send the request
     */
    public function theUserSendTheRequest()
    {
        return $this->iSendTheRequest();
    }

    /**
     * @Given that user to get list of products with size :arg1 or :arg2 or :arg3
     */
    public function thatUserToGetListOfProductsWithSizeOr($arg1, $arg2, $arg3)
    {
        $url = $this->router->generate("get_products", array("_format" => "json",
                "sizes" => "${arg1},${arg2},${arg3}"
        ));
        $this->request = Request::create($url);
    }

    /**
     * @Then the response contains list of products with size :arg1 or :arg2 or :arg3
     */
    public function theResponseContainsListOfProductsWithSize($arg1, $arg2, $arg3)
    {
        $data = json_decode($this->response->getContent(), true);
        $sizes = array($arg1, $arg2, $arg3);
        foreach($data as $product) {
            Test::assertContains($product['size'], $sizes, '', true);
        }
    }

    /**
     * @Given that user to get list of products with color :arg1 or :arg2
     */
    public function thatUserToGetListOfProductsWithColorOr($arg1, $arg2)
    {
        $url = $this->router->generate("get_products", array("_format" => "json",
                "colors" => "${arg1},${arg2}"
        ));
        $this->request = Request::create($url);
    }
    
    /**
     * @Then the response contains list of products with color :arg1 or :arg2
     */
    public function theResponseContainsListOfProductsWithColorOr($arg1, $arg2)
    {
        $data = json_decode($this->response->getContent(), true);
        $colors = array($arg1, $arg2);
        foreach($data as $product) {
            Test::assertContains($product['color'], $colors, '', true);
        }
    }

    /**
     * @Given that user to get list of products with price between :arg1 to :arg2
     */
    public function thatUserToGetListOfProductsWithPriceBetweenTo($arg1, $arg2)
    {
        $url = $this->router->generate("get_products", array("_format" => "json",
                "min" => $arg1,
                "max" => $arg2
        ));
        $this->request = Request::create($url);
    }
    
    /**
     * @Then the response contains list of products with price between :arg1 to :arg2
     */
    public function theResponseContainsListOfProductsWithPriceBetweenTo($arg1, $arg2)
    {
        $data = json_decode($this->response->getContent(), true);
        foreach($data as $product) {
            Test::assertTrue($product['price'] > $arg1);
            Test::assertTrue($product['price'] <= $arg2);
        }
    }

    /**
     * @Given that user to get list of products with size :arg1 or :arg2
     */
    public function thatUserToGetListOfProductsWithSizeOr2($arg1, $arg2)
    {
        $this->productFilter['sizes'] = join(",", array($arg1, $arg2));
    }

    /**
     * @Given colors :arg1 or :arg2
     */
    public function colorsOr($arg1, $arg2)
    {
        $this->productFilter['colors'] = join(",", array($arg1, $arg2));
    }

    /**
     * @Given price between :arg1 to :arg2
     */
    public function priceBetweenTo($arg1, $arg2)
    {
        $url = $this->router->generate("get_products", array("_format" => "json",
                "sizes" => $this->productFilter["sizes"],
                "colors" => $this->productFilter["colors"],
                "min" => $arg1,
                "max" => $arg2
        ));
        $this->request = Request::create($url);
    }
    
    /**
     * @Then the response contains list of products matching all the filters
     */
    public function theResponseContainsListOfProductsMatchingAllTheFilters()
    {
        $data = json_decode($this->response->getContent(), true);
        foreach($data as $product) {
            Test::assertContains($product['size'], $this->productFilter["sizes"], '', true);
            Test::assertContains($product['color'], $this->productFilter["color"], '', true);
            Test::assertTrue($product['price'] > $arg1);
            Test::assertTrue($product['price'] <= $arg2);
        }
    }
}
