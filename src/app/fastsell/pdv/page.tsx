 'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Package, Tag, Barcode, Scale, DollarSign } from 'lucide-react'; // Added more icons
import { useCart } from "@/contexts/CartContext";
import { useSearch } from '@/contexts/SearchContext';
import PacmanLoader from '@/components/PacmanLoader'; // Assuming this component exists and works as expected


type Product = {
  codigo: number;
  nome_produto: string;
  fabricante: string;
  ncm: string;
  codigo_barra: string;
  unidade: string;
  preco_compra: number;
  preco_venda: number;
  quantidade: number;
  categoria: string;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function ProductsPage() {
  const { searchTerm } = useSearch();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for quantities per product, initialized to 1 for all products
  const [quantities, setQuantities] = useState<{ [codigo: number]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          'https://fastsell.gomesweb87.xyz/api/produtos/list',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar produtos.');
        }

        const data = await response.json();
        setProducts(data);
        // Initialize quantities for all fetched products to 1
        const initialQuantities: { [codigo: number]: number } = {};
        data.forEach((product: Product) => {
          initialQuantities[product.codigo] = 1;
        });
        setQuantities(initialQuantities);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /**
   * Handles adding a product to the cart.
   * Resets the quantity for the added product back to 1 in the input field.
   * @param product The product to add to the cart.
   */
  const handleAddToCart = (product: Product) => {
    const quantityToAdd = quantities[product.codigo] || 1; // Use the quantity from state for this product
    addToCart({
      id: product.codigo,
      name: product.nome_produto,
      price: product.preco_venda,
      quantity: quantityToAdd,
    });
    // Reset the quantity for this specific product to 1 in the UI after adding to cart
    setQuantities(prevQuantities => ({ ...prevQuantities, [product.codigo]: 1 }));
  };

  /**
   * Handles changes to the quantity input for a specific product.
   * Ensures the quantity is at least 1.
   * @param codigo The product code.
   * @param value The new quantity value.
   */
  const handleQuantityChange = (codigo: number, value: number) => {
    const newQuantity = Math.max(1, value); // Ensure quantity is never less than 1
    setQuantities(prevQuantities => ({ ...prevQuantities, [codigo]: newQuantity }));
  };

  /**
   * Groups products by their category.
   * @param products The array of products to group.
   * @returns An object where keys are categories and values are arrays of products.
   */
  const groupByCategory = (products: Product[]) => {
    return products.reduce((acc: { [key: string]: Product[] }, product) => {
      const category = product.categoria || 'Sem Categoria';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  };

  // Filter products based on the search term from the global search context
  const filteredProducts = products.filter((product) =>
    product.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Group the filtered products by category
  const groupedProducts = groupByCategory(filteredProducts);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
      {loading ? (
        <div className="flex justify-center items-center  h-96">
          <PacmanLoader />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-red-600 text-lg font-semibold bg-red-100 p-4 rounded-lg shadow-md">
            Erro ao carregar produtos: {error}
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600 text-lg font-semibold bg-white p-4 rounded-lg shadow-md">
            Nenhum produto encontrado.
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {Object.entries(groupedProducts).map(([category, productsInCategory]) => (
            <div key={category} className="mb-10">
              <h2 className="sticky top-0 z-10 bg-blue-700 text-white p-3 rounded-md shadow-md mb-6 text-2xl font-extrabold text-center tracking-wide transform -translate-y-2">
                {category}
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productsInCategory.map((product) => (
                  <div
                    key={product.codigo}
                    className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] border border-gray-200 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-gray-900 leading-tight">
                        {product.nome_produto}
                      </h3>
                      <p className="mb-1 text-base text-gray-700 flex items-center gap-2">
                        <Package size={16} className="text-gray-500" />
                        <strong>Fabricante:</strong> {product.fabricante}
                      </p>
                      <p className="mb-1 text-base text-gray-700 flex items-center gap-2">
                        <Tag size={16} className="text-gray-500" />
                        <strong>NCM:</strong> {product.ncm}
                      </p>
                      <p className="mb-3 text-base text-gray-700 flex items-center gap-2">
                        <Barcode size={16} className="text-gray-500" />
                        <strong>Código de Barras:</strong> {product.codigo_barra}
                      </p>
                      <p className="mb-3 text-base text-gray-700 flex items-center gap-2">
                        <Scale size={16} className="text-gray-500" />
                        <strong>Unidade:</strong> {product.unidade}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-3xl font-extrabold text-blue-700 mb-4 flex items-center gap-2">
                        <DollarSign size={24} className="text-blue-500" />
                        R$ {(Number(product.preco_venda) || 0).toFixed(2).replace('.', ',')}
                      </p>

                      {/* Quantity and Add to Cart button */}
                      <div className="flex items-center gap-3 mt-5">
                        <input
                          type="number"
                          min={1}
                          value={quantities[product.codigo] || 1} // Use the quantity from state for this product
                          onChange={(e) =>
                            handleQuantityChange(product.codigo, parseInt(e.target.value) || 1)
                          }
                          className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg font-medium"
                          aria-label={`Quantidade para ${product.nome_produto}`}
                        />
                        <button
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() => handleAddToCart(product)}
                          aria-label={`Adicionar ${product.nome_produto} ao carrinho`}
                        >
                          <ShoppingCart size={20} />
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Custom CSS for font consistency */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
