#!/bin/bash

# NestJS API Testing Script with curl
# This script tests all implemented endpoints

BASE_URL="http://localhost:3000"

echo "🚀 NestJS API Testing with curl"
echo "======================================"
echo ""

# Test 1: Blockchain - Validate Address (Working)
echo "1️⃣  Blockchain: Validate Ethereum Address"
curl -s -X GET "$BASE_URL/blockchain/validate-address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
echo -e "\n"

# Test 2: Blockchain - Invalid Address
echo "2️⃣  Blockchain: Validate Invalid Address"
curl -s -X GET "$BASE_URL/blockchain/validate-address/invalid-address"
echo -e "\n"

# Test 3: Users - Get All (Pagination)
echo "3️⃣  Users: Get All Users (Paginated)"
curl -s -X GET "$BASE_URL/users?page=1&limit=5"
echo -e "\n"

# Test 4: Users - Create User
echo "4️⃣  Users: Create New User"
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "age": 30
  }'
echo -e "\n"

# Test 5: Users - Get by ID (use an existing ID from Test 4)
echo "5️⃣  Users: Get User by ID"
echo "(Replace USER_ID with actual ID from previous response)"
# curl -s -X GET "$BASE_URL/users/YOUR_USER_ID_HERE"
echo -e "\n"

# Test 6: Users - Update User
echo "6️⃣  Users: Update User"
echo "(Replace USER_ID with actual ID)"
# curl -s -X PATCH "$BASE_URL/users/YOUR_USER_ID_HERE" \
#   -H "Content-Type: application/json" \
#   -d '{"firstName": "Jane Updated", "age": 31}'
echo -e "\n"

# Test 7: Products - Get All
echo "7️⃣  Products: Get All Products"
curl -s -X GET "$BASE_URL/products"
echo -e "\n"

# Test 8: Products - Create Product
echo "8️⃣  Products: Create New Product"
curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1499.99,
    "category": "Electronics",
    "stock": 25
  }'
echo -e "\n"

# Test 9: Products - Get by ID
echo "9️⃣  Products: Get Product by ID"
echo "(Replace PRODUCT_ID with actual ID from previous response)"
# curl -s -X GET "$BASE_URL/products/YOUR_PRODUCT_ID_HERE"
echo -e "\n"

# Test 10: Products - Update Product
echo "🔟 Products: Update Product"
echo "(Replace PRODUCT_ID with actual ID)"
# curl -s -X PATCH "$BASE_URL/products/YOUR_PRODUCT_ID_HERE" \
#   -H "Content-Type: application/json" \
#   -d '{"price": 1299.99, "stock": 20}'
echo -e "\n"

# Test 11: Orders - Get All
echo "1️⃣1️⃣  Orders: Get All Orders"
# Note: This endpoint needs userId query param
# curl -s -X GET "$BASE_URL/orders?userId=YOUR_USER_ID"
echo -e "\n"

# Test 12: Error Handling - Invalid MongoDB ID
echo "1️⃣2️⃣  Error: Invalid MongoDB ObjectId"
curl -s -X GET "$BASE_URL/users/invalid-id"
echo -e "\n"

# Test 13: Error Handling - Missing Required Fields
echo "1️⃣3️⃣  Error: Missing Required Fields"
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{"email": "incomplete@example.com"}'
echo -e "\n"

# Test 14: Error Handling - Invalid Email Format
echo "1️⃣4️⃣  Error: Invalid Email Format"
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "SecurePass123",
    "firstName": "Test",
    "lastName": "User",
    "age": 25
  }'
echo -e "\n"

# Test 15: Error Handling - Weak Password
echo "1️⃣5️⃣  Error: Weak Password"
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "weak@example.com",
    "password": "weak",
    "firstName": "Test",
    "lastName": "User",
    "age": 25
  }'
echo -e "\n"

# Test 16: Swagger Documentation
echo "1️⃣6️⃣  Swagger: API Documentation"
echo "Access Swagger UI at: $BASE_URL/api"
echo -e "\n"

echo "======================================"
echo "✅ API Testing Complete!"
echo ""
echo "📝 Notes:"
echo "  • Some blockchain endpoints need valid ETHEREUM_RPC_URL in .env"
echo "  • Auth endpoints available at /auth/register, /auth/login, /auth/profile"
echo "  • Protected endpoints require JWT token in Authorization header"
echo "  • Swagger docs available at http://localhost:3000/api"
echo ""
