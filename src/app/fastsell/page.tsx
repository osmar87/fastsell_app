"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28'];

export default function Dashboard() {
  const [dataVendas, setDataVendas] = useState<Array<any>>([]);
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState<Array<any>>([]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      axios.get("https://fastsell.gomesweb87.xyz/api/dashboard/", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setDataVendas([
            { name: 'Hoje', vendas: res.data.diario.total_vendas, pedidos: res.data.diario.total_pedidos },
            { name: 'Mensal', vendas: res.data.mensal.total_vendas, pedidos: res.data.mensal.total_pedidos },
            { name: 'Geral', vendas: res.data.geral.total_vendas, pedidos: res.data.geral.total_pedidos },
          ]);
          setProdutosEstoqueBaixo(res.data.estoque_baixo.produtos);
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Título */}
      <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1>

      {/* Gráfico e Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gráfico */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Vendas e Pedidos</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={dataVendas}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill="#6366f1" name="Vendas (R$)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pedidos" fill="#10b981" name="Pedidos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Produtos com Estoque Baixo</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantidade</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {produtosEstoqueBaixo.map((produto) => (
                  <tr key={produto.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{produto.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{produto.nome}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${produto.quantidade <= 2 ? 'text-red-600' : 'text-gray-800'}`}>
                      {produto.quantidade}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}