import { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, UserCheck, Clock, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';

export const DoctorDashboard = () => {
  const [turnos, setTurnos] = useState([]);

  const cargarTurnos = () => {
    API.get('/turnos/').then((res) => setTurnos(res.data));
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await API.patch('/turnos/' + id + '/', { estado: nuevoEstado });
      cargarTurnos();
    } catch (err) {
      alert('Error al actualizar estado del turno');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">
      {/* Header del Dashboard */}
      <header className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Portal Médico / Profesional</h1>
          <p className="text-sm text-slate-500">Gestión de agenda diaria, turnos y fichas clínicas</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 px-4 py-2 rounded-lg text-sm font-semibold">
          <Calendar className="h-4 w-4" />
          <span>Agenda Hoy</span>
        </div>
      </header>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Pacientes Hoy</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{turnos.length}</p>
          </div>
          <div className="p-3 bg-sky-100 text-sky-600 rounded-lg"><UserCheck className="h-6 w-6" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Pendientes</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {turnos.filter(t => t.estado === 'PENDIENTE').length}
            </p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock className="h-6 w-6" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Atendidos</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {turnos.filter(t => t.estado === 'ATENDIDO').length}
            </p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle className="h-6 w-6" /></div>
        </div>
      </div>

      {/* Lista Principal de Pacientes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-sky-600" /> Pacientes Programados
          </h2>
          <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-medium">
            {turnos.length} Citas
          </span>
        </div>

        <div className="p-6">
          {turnos.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-base font-medium">No hay consultas registradas en este momento.</p>
              <p className="text-xs text-slate-400 mt-1">Los turnos solicitados por los pacientes aparecerán reflejados aquí.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {turnos.map((t) => (
                <div key={t.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition duration-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 text-base">{t.paciente_nombre || 'Paciente'}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {t.estado}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-sky-600" />
                      {new Date(t.fecha_hora).toLocaleString('es-AR')}
                    </p>
                    {t.motivo_consulta && (
                      <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 mt-2">
                        <strong className="text-slate-700">Motivo:</strong> {t.motivo_consulta}
                      </p>
                    )}
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <button
                      onClick={() => cambiarEstado(t.id, 'ATENDIDO')}
                      className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-2 rounded-lg transition"
                    >
                      <CheckCircle className="h-4 w-4" /> Atendido
                    </button>
                    <button
                      onClick={() => cambiarEstado(t.id, 'CANCELADO')}
                      className="flex items-center gap-1 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-2 rounded-lg transition"
                    >
                      <XCircle className="h-4 w-4" /> Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
