'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface CalculationResult {
  recommendedSize: string
  actualArea: number
  wastage: number
  totalArea: number
  estimatedPrice: number
  material: string
  usage: string
}

export default function SizeCalculatorPage() {
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: ''
  })
  const [usage, setUsage] = useState('')
  const [material, setMaterial] = useState('')
  const [shape, setShape] = useState('rectangle')
  const [overhang, setOverhang] = useState('0.5')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const materialPrices = {
    PE: { price: 25000, name: 'PE (Polyethylene)' },
    PVC: { price: 45000, name: 'PVC Canvas' },
    Canvas: { price: 35000, name: 'Cotton Canvas' }
  }

  const standardSizes = [
    '2x3m', '3x4m', '4x5m', '4x6m', '5x6m', '6x8m', '8x10m', '10x12m', '12x15m'
  ]

  const handleCalculate = () => {
    if (!dimensions.length || !dimensions.width || !usage || !material) {
      return
    }

    setLoading(true)

    setTimeout(() => {
      const length = parseFloat(dimensions.length)
      const width = parseFloat(dimensions.width)
      const overhangValue = parseFloat(overhang)

      // Calculate required dimensions with overhang
      const requiredLength = length + (overhangValue * 2)
      const requiredWidth = width + (overhangValue * 2)
      const actualArea = requiredLength * requiredWidth

      // Find the best fitting standard size
      let bestSize = ''
      let minWastage = Infinity

      standardSizes.forEach(size => {
        const [sizeLength, sizeWidth] = size.split('x').map(s => parseFloat(s.replace('m', '')))
        
        if (sizeLength >= requiredLength && sizeWidth >= requiredWidth) {
          const sizeArea = sizeLength * sizeWidth
          const wastage = sizeArea - actualArea
          
          if (wastage < minWastage) {
            minWastage = wastage
            bestSize = size
          }
        }
      })

      // If no standard size fits, suggest custom size
      if (!bestSize) {
        bestSize = `${Math.ceil(requiredLength)}x${Math.ceil(requiredWidth)}m (Custom)`
        minWastage = (Math.ceil(requiredLength) * Math.ceil(requiredWidth)) - actualArea
      }

      const totalArea = actualArea + minWastage
      const materialInfo = materialPrices[material as keyof typeof materialPrices]
      const estimatedPrice = totalArea * (materialInfo.price / 6) // Price per square meter

      setResult({
        recommendedSize: bestSize,
        actualArea,
        wastage: minWastage,
        totalArea,
        estimatedPrice,
        material: materialInfo.name,
        usage
      })

      setLoading(false)
    }, 1000)
  }

  const handleReset = () => {
    setDimensions({ length: '', width: '', height: '' })
    setUsage('')
    setMaterial('')
    setShape('rectangle')
    setOverhang('0.5')
    setResult(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tarpaulin Size Calculator</h1>
        <p className="text-lg text-gray-600">
          Calculate the perfect tarpaulin size for your specific needs with our intelligent sizing tool
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Calculate Your Size</CardTitle>
            <CardDescription>
              Enter your requirements to get the optimal tarpaulin size and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={shape} onValueChange={setShape}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rectangle">Rectangle</TabsTrigger>
                <TabsTrigger value="custom">Custom Shape</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rectangle" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="length">Length (meters)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 4.5"
                      value={dimensions.length}
                      onChange={(e) => setDimensions(prev => ({ ...prev, length: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (meters)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 3.2"
                      value={dimensions.width}
                      onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <Alert>
                  <AlertDescription>
                    For custom shapes, please contact our team for a personalized quote.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="length">Length (m)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      value={dimensions.length}
                      onChange={(e) => setDimensions(prev => ({ ...prev, length: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (m)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      value={dimensions.width}
                      onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (m)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="Optional"
                      value={dimensions.height}
                      onChange={(e) => setDimensions(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label>Overhang/Extra Coverage</Label>
              <Select value={overhang} onValueChange={setOverhang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No overhang</SelectItem>
                  <SelectItem value="0.3">30cm overhang</SelectItem>
                  <SelectItem value="0.5">50cm overhang (Recommended)</SelectItem>
                  <SelectItem value="1">1m overhang</SelectItem>
                  <SelectItem value="1.5">1.5m overhang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Intended Usage</Label>
              <Select value={usage} onValueChange={setUsage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select usage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industrial">Industrial/Heavy Duty</SelectItem>
                  <SelectItem value="construction">Construction Site</SelectItem>
                  <SelectItem value="household">Household/Garden</SelectItem>
                  <SelectItem value="agriculture">Agriculture/Farming</SelectItem>
                  <SelectItem value="marine">Marine/Boat Cover</SelectItem>
                  <SelectItem value="event">Event/Temporary Shelter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferred Material</Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PE">PE - Lightweight & Waterproof</SelectItem>
                  <SelectItem value="PVC">PVC - Heavy Duty & Durable</SelectItem>
                  <SelectItem value="Canvas">Canvas - Breathable & Natural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleCalculate}
                disabled={loading || !dimensions.length || !dimensions.width || !usage || !material}
                className="flex-1"
              >
                {loading ? 'Calculating...' : 'Calculate Size'}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>
                  Based on your requirements, here's our recommendation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Recommended Size</h3>
                  <div className="text-2xl font-bold text-blue-900">
                    {result.recommendedSize}
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {result.material}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-900">Required Area</div>
                    <div className="text-lg font-semibold">
                      {result.actualArea.toFixed(2)} m²
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-900">Material Wastage</div>
                    <div className="text-lg font-semibold">
                      {result.wastage.toFixed(2)} m²
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-900">Total Area</div>
                    <div className="text-lg font-semibold">
                      {result.totalArea.toFixed(2)} m²
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="font-medium text-green-900">Estimated Price</div>
                    <div className="text-lg font-bold text-green-900">
                      {formatPrice(result.estimatedPrice)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full">
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Custom Quote
                  </Button>
                </div>

                <div className="text-xs text-gray-600">
                  <p>* Prices are estimates and may vary based on current market rates</p>
                  <p>* Custom sizes may require additional processing time</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Sizing Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">Overhang Recommendations:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>30cm: Minimal coverage, exact fit</li>
                    <li>50cm: Standard recommendation for most uses</li>
                    <li>1m+: Heavy-duty applications, extreme weather</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Material Selection:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>PE: Best for temporary, lightweight applications</li>
                    <li>PVC: Ideal for permanent, heavy-duty use</li>
                    <li>Canvas: Perfect for breathable, natural coverage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Standard Sizes Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Standard Sizes Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {standardSizes.map(size => (
                  <Badge key={size} variant="outline" className="justify-center">
                    {size}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Custom sizes available upon request with 3-5 business days processing time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
