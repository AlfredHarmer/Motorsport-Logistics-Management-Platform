import { useRef } from "react";
import type { TransferStatus } from "./transfers.types";
import './TransferRow.css';

interface TransferRowProps {
  equipmentName: string;
  destinationName: string;
  isDelayed: boolean;
  status: TransferStatus;
  notes: string | null;
}

function TransferRow({ 
  equipmentName,
  destinationName,
  isDelayed,
  status,
  notes,

}: TransferRowProps) {
  const notesDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <article className="transfer-row">
      <div className="transfer-row__summary">
        <div className="transfer-row__equipment">
          <h2>{equipmentName}</h2>
          <p>FR-001</p>
        </div>

        <div className="transfer-row__destination">
          <h3>Next destination</h3>
          <p>{destinationName}</p>
        </div>

        <div className="transfer-row__transport">
          <h3>Transport</h3>
          <p>Team transport</p>
          <p>Last confirmed: Workshop</p>
        </div>

        <div className="transfer-row__timing">
          <h3>Timing</h3>
          <p>Leaving: 10 November, 08:00</p>
          <p>Expected: 11 November, 18:00</p>
        </div>
      
        <div className="transfer-row__status">
          <h3>Status</h3>
          <p>{status}</p>
          {isDelayed && <p>Delayed</p>}
        </div>
      </div>
      

      <p><span>{status}</span> {isDelayed && <span>- Delayed</span>}</p>

      <dialog 
        ref={notesDialogRef}
        className="transfer-notes"
        aria-label={`Notes for ${equipmentName}`}
      >
        <h3>Notes for {equipmentName}</h3>
        <p>{notes ?? "No notes added"}</p>
        <button
          type="button"
          onClick={() => notesDialogRef.current?.close()}
        >
          Close
        </button>
      </dialog>

      <button
        type="button"
        onClick={() => notesDialogRef.current?.showModal()}
      >
       View notes
      </button>
     
    </article>
  );
}

export default TransferRow; 