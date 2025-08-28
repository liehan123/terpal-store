'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'

interface CartItem {
  id: string
  product_id: string
  product_name: string
  product_price: number
  product_image: string
  size: string
  color: string
  quantity: number
  created_at: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savedItems, setSavedItems] = useState<CartItem[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    loadCartItems()
    loadSavedItems()
  }, [])

  const loadCartItems = () => {
    try {
      const items = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(items)
    } catch (error) {
      console.error('Error loading cart items:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const loadSavedItems = () => {
    try {
      const items = JSON.parse(localStorage.getItem('savedItems') || '[]')
      setSavedItems(items)
    } catch (error) {
      console.error('Error loading saved items:', error)
      setSavedItems([])
    }
  }

  const updateCartItems = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const updateSavedItems = (items: CartItem[]) => {
    setSavedItems(items)
    localStorage.setItem('savedItems', JSON.stringify(items))
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    updateCartItems(updatedItems)
  }

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    updateCartItems(updatedItems)
  }

  const saveForLater = (itemId: string) => {
    const itemToSave = cartItems.find(item => item.id === itemId)
    if (itemToSave) {
      const updatedCartItems = cartItems.filter(item => item.id !== itemId)
      const updatedSavedItems = [...savedItems, itemToSave]
      
      updateCartItems(updatedCartItems)
      updateSavedItems(updatedSavedItems)
    }
  }

  const moveToCart = (itemId: string) => {
    const itemToMove = savedItems.find(item => item.id === itemId)
    if (itemToMove) {
      const updatedSavedItems = savedItems.filter(item => item.id !== itemId)
      const updatedCartItems = [...cartItems, itemToMove]
      
      updateCartItems(updatedCartItems)
      updateSavedItems(updatedSavedItems)
    }
  }

  const removeSavedItem = (itemId: string) => {
    const updatedSavedItems = savedItems.filter(item => item.id !== itemId)
    updateSavedItems(updatedSavedItems)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product_price * item.quantity), 0)
  }

  const calculateShipping = () => {
    // Simple shipping calculation - in real app this would be more complex
    const subtotal = calculateSubtotal()
    if (subtotal === 0) return 0
    if (subtotal > 100000) return 0 // Free shipping over 100k
    return 15000 // Standard shipping
  }

  const calculateTax = () => {
    // 11% PPN (VAT) in Indonesia
    return calculateSubtotal() * 0.11
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax()
  }

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    if (cartItems.length === 0) {
      return
    }
    
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 && savedItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <span className="text-6xl text-gray-300">🛒</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Cart Items */}
            {cartItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/30009f14-a55a-469d-bebb-fb9d8e3f96f3.png'
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.product_price)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveForLater(item.id)}
                        >
                          Save for Later
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved for Later ({savedItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/30009f14-a55a-469d-bebb-fb9d8e3f96f3.png'
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.product_price)}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveToCart(item.id)}
                        >
                          Move to Cart
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSavedItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? 'Free' : formatPrice(calculateShipping())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (PPN 11%)</span>
                      <span>{formatPrice(calculateTax())}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  {calculateShipping() === 0 && calculateSubtotal() > 100000 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        🎉 You qualify for free shipping!
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                    disabled={cartItems.length === 0}
                  >
                    {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                  </Button>

                  <div className="text-center">
                    <Link href="/products">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  <div className="text-xs text-gray-600 text-center">
                    <p>Secure checkout with SSL encryption</p>
                    <p>Free shipping on orders over Rp 100,000</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
