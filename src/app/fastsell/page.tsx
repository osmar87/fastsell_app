'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from "@/contexts/CartContext"
import { useSearch } from '@/contexts/SearchContext';


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
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado do carrinho
  const [cart, setCart] = useState<CartItem[]>([]);

  // Estado das quantidades por produto
  const [quantities, setQuantities] = useState<{ [codigo: number]: number }>({});
  const [quantitie, setQuantitie] = useState<number>();

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
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.codigo,
      name: product.nome_produto,
      price: product.preco_venda,
      quantity: quantitie || 1,
    })
    setQuantities({ ...quantities, [product.codigo]: 1 });
    setQuantitie(1)
  };

  const handleQuantityChange = (codigo: number, value: number) => {
    setQuantities({ ...quantities, [codigo]: value });
    setQuantitie(value)
  };

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

  const filteredProducts = products.filter((product) =>
    product.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const groupedProducts = groupByCategory(filteredProducts);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {loading ? (
        <p className="text-gray-600">Carregando produtos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid ">
          {Object.entries(groupedProducts).map(([category, productsInCategory]) => (
            <div key={category} className="">
              <h2 className="mb-4 text-2xl font-bold text-gray-100 bg-gray-900 p-2">
                {category}
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-5">
                {productsInCategory.map((product) => (
                  <div
                    key={product.codigo}
                    className="rounded-lg bg-white p-5 shadow hover:shadow-lg transition"
                  >
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {product.nome_produto}
                    </h3>
                    <p className="mb-1 text-sm text-gray-600">
                      <strong>Fabricante:</strong> {product.fabricante}
                    </p>
                    <p className="mb-1 text-sm text-gray-600">
                      <strong>NCM:</strong> {product.ncm}
                    </p>
                    <p className="mb-3 text-sm text-gray-600">
                      <strong>Código de Barras:</strong> {product.codigo_barra}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      R$ {(Number(product.preco_venda) || 0).toFixed(2).replace('.', ',')}
                    </p>

                    {/* Quantidade e botão */}
                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="number"
                        min={1}
                        value={quantities[product.codigo] || 1}
                        onChange={(e) =>
                          handleQuantityChange(product.codigo, parseInt(e.target.value) || 1)
                        }
                        className="w-16 rounded border border-gray-300 px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        className="flex items-center gap-2 rounded bg-blue-500 px-3 py-1.5 text-white hover:bg-blue-600"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={16} />
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
