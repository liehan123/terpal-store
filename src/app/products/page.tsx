'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { supabase, Product } from '@/lib/supabase'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all')
  const [selectedUsage, setSelectedUsage] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState<string>('name')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, selectedMaterial, selectedUsage, selectedBrand, priceRange, sortBy])

  const fetchProducts = async () => {
    try {
      // Mock data for now - in real app this would fetch from Supabase
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
        },
        {
          id: '4',
          name: 'Ultra Heavy PVC Tarp',
          description: 'Extra heavy-duty PVC tarpaulin for extreme weather conditions',
          price: 65000,
          category: 'Industrial',
          material: 'PVC',
          sizes: ['4x6m', '6x8m', '8x10m', '10x12m'],
          thickness: '900 GSM',
          colors: ['Black', 'Navy Blue', 'Forest Green'],
          brand: 'MaxShield',
          usage: 'industrial',
          stock_quantity: 45,
          images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/55deabc7-0da0-48d2-a37d-1d68287cd372.png'],
          specifications: {
            material: 'Heavy PVC',
            weight: '900 GSM',
            waterproof: true,
            windResistant: true,
            temperatureRange: '-40°C to +70°C'
          },
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Eco-Friendly PE Tarp',
          description: 'Environmentally conscious PE tarpaulin made from recycled materials',
          price: 22000,
          category: 'Eco-Friendly',
          material: 'PE',
          sizes: ['2x3m', '3x4m', '4x6m'],
          thickness: '180 GSM',
          colors: ['Green', 'Blue', 'Gray'],
          brand: 'EcoTarp',
          usage: 'household',
          stock_quantity: 120,
          images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d4419bf5-f4fa-426e-bf2a-6b48c5b88fa1.png'],
          specifications: {
            material: 'Recycled Polyethylene',
            weight: '180 GSM',
            recyclable: true,
            biodegradable: false
          },
          created_at: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Professional Canvas Tarp',
          description: 'High-grade canvas tarpaulin for professional construction projects',
          price: 38000,
          category: 'Construction',
          material: 'Canvas',
          sizes: ['3x4m', '4x6m', '6x8m', '8x10m'],
          thickness: '500 GSM',
          colors: ['Khaki', 'Brown', 'Olive'],
          brand: 'ProCanvas',
          usage: 'construction',
          stock_quantity: 75,
          images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2eebf764-9be5-408a-9bc9-8a8119319c1a.png'],
          specifications: {
            material: 'Heavy Canvas',
            weight: '500 GSM',
            breathable: true,
            fireRetardant: true
          },
          created_at: new Date().toISOString()
        }
      ]
      
      setProducts(mockProducts)
      // Set initial price range based on products
      const prices = mockProducts.map(p => p.price)
      setPriceRange([Math.min(...prices), Math.max(...prices)])
    } catch (err) {
      setError('Failed to load products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Material filter
    if (selectedMaterial !== 'all') {
      filtered = filtered.filter(product => product.material === selectedMaterial)
    }

    // Usage filter
    if (selectedUsage !== 'all') {
      filtered = filtered.filter(product => product.usage === selectedUsage)
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'stock':
          return b.stock_quantity - a.stock_quantity
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const uniqueBrands = [...new Set(products.map(p => p.brand))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p className="text-lg text-gray-600">
          Discover our comprehensive range of premium tarpaulins for every need
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search Products</Label>
                <Input
                  id="search"
                  placeholder="Search by name, brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Material Filter */}
              <div>
                <Label>Material</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Materials</SelectItem>
                    <SelectItem value="PE">PE (Polyethylene)</SelectItem>
                    <SelectItem value="PVC">PVC</SelectItem>
                    <SelectItem value="Canvas">Canvas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Usage Filter */}
              <div>
                <Label>Usage</Label>
                <Select value={selectedUsage} onValueChange={setSelectedUsage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Uses</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="household">Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div>
                <Label>Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {uniqueBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <Label>Price Range</Label>
                <div className="px-2 py-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={Math.max(...products.map(p => p.price))}
                    min={Math.min(...products.map(p => p.price))}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedMaterial('all')
                  setSelectedUsage('all')
                  setSelectedBrand('all')
                  const prices = products.map(p => p.price)
                  setPriceRange([Math.min(...prices), Math.max(...prices)])
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="stock">Stock Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedMaterial('all')
                  setSelectedUsage('all')
                  setSelectedBrand('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <img
                      src={product.images[0]}
                      alt={`${product.name} - ${product.description}`}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c8b72b40-73ad-44fb-a61d-186f03ed6c5d.png'
                      }}
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                      <Badge variant="secondary">{product.material}</Badge>
                    </div>
                    <CardDescription className="mb-3 line-clamp-2">
                      {product.description}
                    </CardDescription>
                    <div className="space-y-1 mb-4 text-sm text-gray-600">
                      <p><span className="font-medium">Brand:</span> {product.brand}</p>
                      <p><span className="font-medium">Thickness:</span> {product.thickness}</p>
                      <p><span className="font-medium">Stock:</span> {product.stock_quantity} units</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <Link href={`/products/${product.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
