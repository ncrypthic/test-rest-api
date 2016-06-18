Feature: Product
    Scenario: Add product
        Given that user want to create a product under category "Category 1"
        And user is a valid api subscriber
        When user send the request
        Then the response is JSON
        And the response has an "id" property
        And that the "id" is a number
    Scenario: Get a product
        Given that user to get a product that was created
        And user is a valid api subscriber
        When user send the request
        Then the response is JSON
        And the response has an "id" property
        And the response has an "category" property
    Scenario: List all products
        Given that user to get list of all products
        And the user is a valid api subscriber
        When the user send the request
        Then the response is JSON
        And the response list all product
    Scenario: List all product under a category
        Given that user to get list of products under specific category "Category 1"
        And the user is a valid api subscriber
        When the user send the request
        Then the response is JSON
        And the response contains list of products under category "Category 1"
    Scenario: Filter product by sizes
        Given that user to get list of products with size "S" or "M" or "XL"
        And the user is a valid api subscriber
        When the user send the request
        Then the response is JSON
        And the response contains list of products with size "S" or "M" or "XL"
    Scenario: Filter product by colors
        Given that user to get list of products with color "blue" or "black"
        And the user is a valid api subscriber
        When the user send the request
        Then the response is JSON
        And the response contains list of products with color "blue" or "black"
    Scenario: Filter product by price range
        Given that user to get list of products with price between 100000 to 999999
        And the user is a valid api subscriber
        When the user send the request
        Then the response is JSON
        And the response contains list of products with price between 100000 to 999999
    Scenario: Filter product by sizes, colors and price range
        Given that user to get list of products with size "S" or "M"
        And colors "black" or "blue"
        And price between 100000 to 300000
        And the user is a valid api subscriber
        When the user send the request
        Then the response is JSON
        And the response contains list of products matching all the filters
    Scenario: Delete a product category
        Given that user delete a product that was created
        When the user send the request
        Then try to find deleted product
        And the user send the request
        Then the response is not found