//mostra um campo de data + 2 botões. 
//Não sabe nada sobre a NASA nem sobre fetch — só mostra inputs e avisa o "pai" quando algo é clicado.
//		

export default function EpicDateControls({ date, onDateChange, onLoad, onLatest }) {
  return (
    <div className="date-controls">
      <label>DATA:</label>
      <input 
        type="date" 
        value={date} 
        onChange={e => onDateChange(e.target.value)} 
      />
      <button onClick={onLoad}>CARREGAR</button>
      <button onClick={onLatest}>● MAIS RECENTE</button>
    </div>
  );
}

//notas
// 1. Este componente é responsável apenas por renderizar os controles de data e botões, sem lógica de carregamento de fotos.
// 2. Ele recebe a data atual e funções de callback como props, permitindo que o componente pai gerencie o estado e a lógica de carregamento.
// 3. O input de data permite ao usuário selecionar uma data específica, enquanto os botões permitem carregar fotos da data selecionada ou as mais recentes.
// 4. O componente é reutilizável e independente, podendo ser facilmente integrado em outros contextos se necessário.
// 5. A função onDateChange é chamada sempre que o usuário altera a data no input, permitindo que o componente pai atualize o estado da data selecionada.