"use client";

import { useEffect, useState } from "react";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://fastsell.gomesweb87.xyz/api/produtos/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Se precisa de token, descomente abaixo e coloque seu token
              // Authorization: `Bearer SEU_TOKEN_AQUI`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar produtos.");
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Listagem de Produtos</h1>

      {loading ? (
        <p className="text-gray-600">Carregando produtos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.codigo}
              className="rounded-lg bg-white p-5 shadow hover:shadow-lg transition"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {product.nome_produto}
              </h2>
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
                R$ {(Number(product.preco_venda) || 0).toFixed(2).replace(".", ",")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
