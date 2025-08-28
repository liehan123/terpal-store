'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase, Product } from '@/lib/supabase'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      // For now, we'll use mock data since Supabase tables aren't set up yet
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Heavy Duty PE Tarpaulin',
          description: 'Waterproof and UV-resistant PE tarpaulin perfect for industrial use',
          price: 25000,
          category: 'Industrial',
          material: 'PE',
          sizes: ['2x3m', '3x4m', '4x6m', '6x8m'],
          thickness: '200 GSM',
          colors: ['Blue', 'Green', 'Silver'],
          brand: 'TerpalPro',
          usage: 'industrial',
          stock_quantity: 150,
          images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/20c67e08-51de-47df-bb2e-9943a65bf23d.png'],
          specifications: {
            material: 'Polyethylene',
            weight: '200 GSM',
            waterproof: true,
            uvResistant: true
          },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Premium PVC Canvas Tarp',
          description: 'Durable PVC canvas tarpaulin for construction and outdoor applications',
          price: 45000,
          category: 'Construction',
          material: 'PVC',
          sizes: ['3x4m', '4x6m', '6x8m', '8x10m'],
          thickness: '650 GSM',
          colors: ['Olive Green', 'Brown', 'Gray'],
          brand: 'CanvasMaster',
          usage: 'construction',
          stock_quantity: 85,
          images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2b6f4141-b710-409a-bad9-5927a9c52202.png'],
          specifications: {
            material: 'PVC Canvas',
            weight: '650 GSM',
            waterproof: true,
            tearResistant: true
          },
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Lightweight Canvas Cover',
          description: 'Breathable canvas tarpaulin ideal for household and light commercial use',
          price: 18000,
          category: 'Household',
          material: 'Canvas',
          sizes: ['2x3m', '3x4m', '4x5m'],
          thickness: '300 GSM',
          colors: ['Natural', 'White', 'Beige'],
          brand: 'HomeCover',
          usage: 'household',
          stock_quantity: 200,
          images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/11675ab2-e7e9-4a00-b922-73da5f447a78.png'],
          specifications: {
            material: 'Cotton Canvas',
            weight: '300 GSM',
            breathable: true,
            naturalFiber: true
          },
          created_at: new Date().toISOString()
        }
      ]
      
      setFeaturedProducts(mockProducts)
    } catch (err) {
      setError('Failed to load featured products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
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
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchFeaturedProducts}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Tarpaulin Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Industrial grade PE, PVC, and canvas materials for all your coverage needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Shop Now
                </Button>
              </Link>
              <Link href="/quote">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Get Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TerpalStore?</h2>
            <p className="text-lg text-gray-600">Quality materials, competitive prices, and expert service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-gray-600">Industrial-grade materials tested for durability and weather resistance</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
                <p className="text-gray-600">Size calculator and custom cutting services for your specific needs</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                <p className="text-gray-600">Quick processing and reliable shipping across Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Our most popular tarpaulin solutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={product.images[0]}
                    alt={`${product.name} - High quality tarpaulin display showing detailed product images`}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c8b72b40-73ad-44fb-a61d-186f03ed6c5d.png'
                    }}
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary">{product.material}</Badge>
                  </div>
                  <CardDescription className="mb-4">
                    {product.description}
                  </CardDescription>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Thickness:</span> {product.thickness}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Available sizes:</span> {product.sizes.slice(0, 2).join(', ')}
                      {product.sizes.length > 2 && ` +${product.sizes.length - 2} more`}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Stock:</span> {product.stock_quantity} units
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Get a personalized quote for your specific tarpaulin requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Size Calculator
              </Button>
            </Link>
            <Link href="/quote">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
