"use client"

import React from 'react'
import ProductCard from './productCard/page'
import { product, category as CategoryType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import _ from 'lodash'

interface Property {
  name: string;
}

type Category = CategoryType & { mainProps: Property[] };

export default function ProductsTable() {

  const router = useRouter()

  const [products, setProducts] = React.useState([] as product[])
  const [categories, setCategories] = React.useState([] as Category[])
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  React.useEffect(() => {
    fetch("/api/products")
      .then((data) => data.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products", error))
  }, [])

  React.useEffect(() => {
    fetch("api/category")
      .then((data) => data.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories", error))
  }, [])

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryValue = event.target.value;

    setSelectedCategory(selectedCategoryValue !== 'all' ? categories.find(category => category.id === selectedCategoryValue) || null : null);
  }

  const debouncedSearch = _.debounce((productName: string) => {
    fetch(`/api/products/search?name=${productName}`)
      .then(response => response.json())
      .then(data => setProducts(data));
  }, 300);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const productName = event.target.value;
    if (productName) {
      debouncedSearch(productName);
    } else {
      fetch("/api/products")
        .then((data) => data.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error("Error fetching products", error))
    }
  }

  const filteredProducts = selectedCategory
    ? products.filter((item) => item.category === selectedCategory.id)
    : products;

  return (
    <div className='flex flex-col mx-10 mt-2 mb-4 pb-8 rounded-xl shadow-md bg-white'>
      <div className='flex flex-row justify-between px-10 my-4'>
        <select
          className='cursor-pointer hover:bg-slate-100 text-gray-500 font-bold border border-gray-300 rounded-xl px-3 py-2 focus:outline-none transition duration-300 ease-in-out'
          value={selectedCategory ? selectedCategory.id : 'all'}
          onChange={handleCategoryChange}
          required
        >
          <option value='all' className='text-black'>All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id} className='text-black flex flex-row'>
              <span>{category.name}</span>
            </option>
          ))}
        </select>
        <div className='flex flex-row items-center w-full max-w-screen-lg justify-center bg-white'>
          <h1 className='text-gray-500 font-bold'>Search Product:</h1>
          <input
            className='ml-4 px-3 py-2 bg-white w-full max-w-screen-sm border-b-2 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out hover:border-gray-300'
            type='text'
            placeholder='Enter your text...'
            style={{ color: 'black' }}
            onChange={handleSearch}
          />
        </div>
      </div>
      <button
        className='bg-blue-600 hover:bg-blue-700 self-end font-bold text-md px-4 py-2 mr-10 rounded-xl transition duration-300 ease-in-out transform hover:scale-105'
        onClick={() => router.push('/products/add')}>New Product +</button>
      <div className='flex flex-row flex-wrap mx-6 justify-between'>
        {filteredProducts.map((item) => (
          <li className='flex flex-row flex-wrap'>
            <ProductCard product={item} category={selectedCategory} />
          </li>
        ))}
      </div>
    </div>
  )
}
