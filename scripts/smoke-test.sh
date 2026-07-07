#!/usr/bin/env bash

set -e

BASE_URL="http://localhost:3001"

echo ""
echo "== Express API Foundations Smoke Test =="
echo "Base URL: $BASE_URL"
echo ""

echo "1) Health check"
curl -s "$BASE_URL/api/health" | jq
echo ""

echo "2) List products"
curl -s "$BASE_URL/api/products" | jq
echo ""

echo "3) List products with filters, pagination and sorting"
curl -s "$BASE_URL/api/products?category=accessories&page=1&limit=1&sortBy=price&direction=desc" | jq
echo ""

echo "4) Products stats summary"
curl -s "$BASE_URL/api/products/stats/summary" | jq
echo ""

echo "5) Get product by id"
curl -s "$BASE_URL/api/products/prod_001" | jq
echo ""

echo "6) Create product"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smoke Test Product",
    "category": "testing",
    "price": 150,
    "stock": 2
  }')

echo "$CREATE_RESPONSE" | jq

PRODUCT_ID=$(node -e "const data = JSON.parse(process.argv[1]); console.log(data.id);" "$CREATE_RESPONSE")

echo ""
echo "Created product id: $PRODUCT_ID"
echo ""

echo "7) Patch created product"
curl -s -X PATCH "$BASE_URL/api/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smoke Test Product Updated",
    "price": 175,
    "active": false
  }' | jq
echo ""

echo "8) Get updated product"
curl -s "$BASE_URL/api/products/$PRODUCT_ID" | jq
echo ""

echo "9) Delete created product"
curl -s -X DELETE "$BASE_URL/api/products/$PRODUCT_ID" | jq
echo ""

echo "10) Confirm deleted product not found"
curl -s "$BASE_URL/api/products/$PRODUCT_ID" | jq
echo ""

echo "11) Route not found"
curl -s "$BASE_URL/api/no-existe" | jq
echo ""

echo "12) Validation error"
curl -s "$BASE_URL/api/products?sortBy=rating" | jq
echo ""

unset CREATE_RESPONSE PRODUCT_ID

echo "Smoke test finished successfully."
echo ""
