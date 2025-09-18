import React from 'react';
import './DashboardSidebar.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const statsData = [
  { name: 'Acessos', value: 12 },
  { name: 'Atividades', value: 8 },
];
const COLORS = ['#667eea', '#764ba2'];

const DashboardSidebar: React.FC<{ onFilterChange?: (filter: string) => void }> = ({ onFilterChange }) => {
  return (
    <aside className="dashboard-sidebar">
      {/* Mini perfil */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar" />
        <div className="sidebar-username">João</div>
        <button className="sidebar-profile-btn">Ver perfil / Configurações</button>
      </div>

      {/* Menu rápido */}
      <nav className="sidebar-menu">
        <div className="sidebar-menu-title">Menu rápido / Atalhos</div>
        <ul>
          <li><a href="/biblioteca">Biblioteca</a></li>
          <li><a href="/atividades">Atividades</a></li>
          <li><a href="#">Favoritos / Salvos</a></li>
        </ul>
      </nav>

      {/* Estatísticas pessoais */}
      <div className="sidebar-stats">
        <div className="sidebar-stats-title">Estatísticas pessoais</div>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie data={statsData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={28} outerRadius={45} fill="#8884d8" label>
              {statsData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="sidebar-stats-legend">
          <span className="legend-accessos" /> Acessos
          <span className="legend-atividades" /> Atividades
        </div>
      </div>

      {/* Filtro */}
      <div className="sidebar-filter">
        <div className="sidebar-filter-title">Filtro</div>
        <div className="sidebar-filter-btns">
          <button onClick={() => onFilterChange && onFilterChange('all')}>Todos</button>
          <button onClick={() => onFilterChange && onFilterChange('article')}>Só artigos</button>
          <button onClick={() => onFilterChange && onFilterChange('activity')}>Só atividades</button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
