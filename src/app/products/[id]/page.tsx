'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase, Product } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      // Mock data for now - in real app this would fetch from Supabase
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Heavy Duty PE Tarpaulin',
          description: 'Waterproof and UV-resistant PE tarpaulin perfect for industrial use. This premium quality tarpaulin is designed to withstand harsh weather conditions and provide reliable protection for your valuable assets.',
          price: 25000,
          category: 'Industrial',
          material: 'PE',
          sizes: ['2x3m', '3x4m', '4x6m', '6x8m'],
          thickness: '200 GSM',
          colors: ['Blue', 'Green', 'Silver'],
          brand: 'TerpalPro',
          usage: 'industrial',
          stock_quantity: 150,
          images: [
            'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b26654ec-2d11-41ca-8d9d-c3a59035da0f.png',
            'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6f912f68-60cb-4c61-898a-0500fae857f4.png',
            'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3f005389-49a7-4139-9071-2eac663ca057.png'
          ],
          specifications: {
            material: 'High-density Polyethylene',
            weight: '200 GSM',
            waterproof: true,
            uvResistant: true,
            tearStrength: 'High',
            temperatureRange: '-30°C to +70°C',
            warranty: '2 years'
          },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Premium PVC Canvas Tarp',
          description: 'Durable PVC canvas tarpaulin for construction and outdoor applications. Features reinforced edges and superior tear resistance for demanding professional use.',
          price: 45000,
          category: 'Construction',
          material: 'PVC',
          sizes: ['3x4m', '4x6m', '6x8m', '8x10m'],
          thickness: '650 GSM',
          colors: ['Olive Green', 'Brown', 'Gray'],
          brand: 'CanvasMaster',
          usage: 'construction',
          stock_quantity: 85,
          images: [
            'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e45ed23c-b692-4273-9876-7742cb6c03e7.png',
            'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a7c238a4-ba9d-4464-9051-a9007fefa105.png',
            'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fc1af6d3-e82f-4155-af57-ca8220ae0d56.png'
          ],
          specifications: {
            material: 'PVC-coated Canvas',
            weight: '650 GSM',
            waterproof: true,
            tearResistant: true,
            fireRetardant: true,
            mildewResistant: true,
            warranty: '3 years'
          },
          created_at: new Date().toISOString()
        }
      ]
      
      const foundProduct = mockProducts.find(p => p.id === productId)
      if (foundProduct) {
        setProduct(foundProduct)
        setSelectedSize(foundProduct.sizes[0])
        setSelectedColor(foundProduct.colors[0])
      } else {
        setError('Product not found')
      }
    } catch (err) {
      setError('Failed to load product')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!selectedSize || !selectedColor) {
      setCartMessage('Please select size and color')
      return
    }

    setAddingToCart(true)
    setCartMessage(null)

    try {
      // In a real app, this would add to Supabase cart table
      // For now, we'll use localStorage
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItemIndex = cartItems.findIndex((item: any) => 
        item.product_id === productId && 
        item.size === selectedSize && 
        item.color === selectedColor
      )

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity
      } else {
        cartItems.push({
          id: Date.now().toString(),
          product_id: productId,
          product_name: product?.name,
          product_price: product?.price,
          product_image: product?.images[0],
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
          created_at: new Date().toISOString()
        })
      }

      localStorage.setItem('cart', JSON.stringify(cartItems))
      setCartMessage('Added to cart successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => setCartMessage(null), 3000)
    } catch (err) {
      setCartMessage('Failed to add to cart')
      console.error('Error adding to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-gray-900">Products</Link></li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.images[0]}
              alt={`${product.name} - Main product view`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/67fd7f8e-aea9-4d96-81b2-f3bf1a3b195e.png'
              }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image}
                    alt={`${product.name} - Additional view ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/72833d19-2d1a-456a-aa5a-0707b65c7127.png'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <Badge variant="secondary">{product.material}</Badge>
            </div>
            <p className="text-lg text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <Badge variant="outline">
                {product.stock_quantity} in stock
              </Badge>
            </div>
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            {cartMessage && (
              <Alert className={cartMessage.includes('success') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={cartMessage.includes('success') ? 'text-green-800' : 'text-red-800'}>
                  {cartMessage}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="size">Size</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map(color => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock_quantity === 0}
              className="w-full"
              size="lg"
            >
              {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/calculator">
                <Button variant="outline" className="w-full">
                  Size Calculator
                </Button>
              </Link>
              <Link href="/quote">
                <Button variant="outline" className="w-full">
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="specifications" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-600">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Brand:</span>
                    <span className="text-gray-600">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span className="text-gray-600">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Usage:</span>
                    <span className="text-gray-600 capitalize">{product.usage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Thickness:</span>
                    <span className="text-gray-600">{product.thickness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Available Sizes:</span>
                    <span className="text-gray-600">{product.sizes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Available Colors:</span>
                    <span className="text-gray-600">{product.colors.join(', ')}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
