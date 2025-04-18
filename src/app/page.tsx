'use client';

import { useState, useEffect } from 'react';
import { v4 } from '@lukeed/uuid';
import { Trash, Plus, X } from 'lucide-react';

export default function Home() {
  const [background, setBackground] = useState('bg1');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [columns, setColumns] = useState<{id: string, index: number, title: string, notes: {id: string, text: string}[]}[]>([]);

  useEffect(() => {
    const savedColumns = localStorage.getItem('columns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  const toggleBackground = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setBackground(background === 'bg1' ? 'bg2-1' : 'bg1');
      setIsTransitioning(false);
    }, 500);
  };

  const addColumn = () => {
    setColumns([...columns, {id: v4(), index: columns.length, title: '', notes: []}]);
  };

  const removeColumn = (columnId: string) => {
    setColumns(columns.filter(column => column.id !== columnId));
  };

  const addNote = (columnId: string) => {
    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          notes: [...column.notes, {id: v4(), text: ''}]
        };
      }
      return column;
    }));
  };

  const removeNote = (columnId: string, noteId: string) => {
    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          notes: column.notes.filter(note => note.id !== noteId)
        };
      }
      return column;
    }));
  };

  const updateColumnTitle = (columnId: string, title: string) => {
    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return { ...column, title };
      }
      return column;
    }));
  };

  const updateNoteText = (columnId: string, noteId: string, text: string) => {
    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          notes: column.notes.map(note =>
            note.id === noteId ? { ...note, text } : note
          )
        };
      }
      return column;
    }));
  };

  return (
    <div
      className={`bg-cover bg-center min-h-screen transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundImage: `url('/${background}.gif')` }}
    >
      <div className="fixed top-4 left-4 z-10">
        <h1 className="text-white text-xl md:text-3xl font-bold">DeepNotes</h1>
      </div>

      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <button 
          onClick={addColumn}
          className="px-[15px] md:px-[30px] py-[8px] md:py-[12.5px] border border-gray-300 rounded-[100px] bg-opacity-50 backdrop-blur-sm text-white text-sm md:text-base font-bold transition-all duration-500 hover:bg-opacity-70 hover:shadow-[0_0_20px_#ffffff50] hover:scale-110 active:bg-opacity-30 active:shadow-none active:scale-[0.98] active:duration-[0.25s]"
        >
          Nova Coluna
        </button>
        <div className="relative">      
        </div>
      </div>

      <div className="fixed overflow-x-auto w-full h-[85vh] md:h-[80vh] top-[15vh] md:top-[10vh]">
        <div className="flex gap-3 md:gap-5 px-3 md:px-5 min-w-max">
          {columns.map((column) => (
            <div
              key={column.id}
              className="min-w-[250px] md:min-w-[300px] rounded-lg h-[70vh] md:h-[76vh] bg-black/20 backdrop-blur-md border-2 border-white/20"
            >
              <div className="p-2 md:p-4 flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Nova Coluna"
                  value={column.title}
                  onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                  className="w-full bg-transparent border-none text-white text-lg md:text-xl font-bold focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => addNote(column.id)}
                    className="text-white hover:text-gray-300 transition-all duration-500 hover:scale-110 active:scale-[0.98]"
                  >
                    <Plus size={20} className="md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={() => removeColumn(column.id)}
                    className="text-white hover:text-gray-300 transition-all duration-500 hover:scale-110 active:scale-[0.98]"
                  >
                    <Trash size={20} className="md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
              <div className="p-2 md:p-4 space-y-3 md:space-y-4 overflow-y-auto h-[calc(70vh-64px)] md:h-[calc(76vh-80px)]">
                {column.notes.map(note => (
                  <div key={note.id} className="relative h-[calc(70vh/3)] md:h-[calc(76vh/3)] p-2 md:p-4 bg-black/10 border border-gray-300/30 rounded-lg">
                    <button
                      onClick={() => removeNote(column.id, note.id)}
                      className="absolute top-1 md:top-2 right-1 md:right-2 text-white hover:text-gray-300 transition-all duration-500 hover:scale-110 active:scale-[0.98] active:shadow-none"
                    >
                      <X size={16} className="md:w-5 md:h-5" />
                    </button>
                    <textarea
                      className="w-full h-full bg-transparent border-none text-white text-sm md:text-base resize-none focus:outline-none"
                      placeholder="Digite sua nota..."
                      value={note.text}
                      onChange={(e) => updateNoteText(column.id, note.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-10">
        <button 
          onClick={toggleBackground}
          className="px-[15px] md:px-[30px] py-[8px] md:py-[12.5px] border border-gray-300 rounded-[100px] bg-opacity-50 backdrop-blur-sm text-white text-sm md:text-base font-bold transition-all duration-500 hover:bg-opacity-70 hover:shadow-[0_0_20px_#ffffff50] hover:scale-110 active:bg-opacity-30 active:shadow-none active:scale-[0.98] active:duration-[0.25s]"
        >
          Background
        </button>
      </div>
    </div>
  );
}
