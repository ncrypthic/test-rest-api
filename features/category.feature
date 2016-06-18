Feature: category
    Scenario: Add product category
        Given that I want to create a category with name "Category 5" as a sub category of "Category 1"
        And I am a valid api subscriber
        When I send the request
        Then the response is JSON
        And the response has an "id" property
        And that the "id" is a number
    Scenario: Get a product category
        Given that I want to get a category that was created
        And I am a valid api subscriber
        When I send the request
        Then the response is JSON
        And the response has an "id" property
        And the response has an "children" property
        And the response has an "parent" property
        And if the "parent" property is not empty it should have an "id" property
    Scenario: List all product categories
        Given that I want to get list of product categories
        And I am a valid api subscriber
        When I send the request
        Then the response is JSON
        And the response contains tree of product categories
    Scenario: Delete a product category
        Given that I want to delete product category that was created
        When I send the request
        Then try to find deleted category
        And I send the request
        Then the response is not found