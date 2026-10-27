import TransferRow from "./TransferRow"
import type { TransferListItem } from "./transfers.types";


function TransfersPage() {
  
  const transfers: TransferListItem[] = [
    {
      id: 1,
      equipmentName: "WEC Fuel Rig",
      destinationName: "Spa-Francorchamps",
      isDelayed: true,
      status: "in_transit",
      notes: null,
    },
    {
      id: 2,
      equipmentName: "Garage Compressor",
      destinationName: "Team Workshop",
      isDelayed: false,
      status: "planned",
      notes: "Load with garage equipment",
    },
  ];

  return (
    <div>
      <h1>Logistics Tracker</h1>
      {transfers.map((transfer) => (
        <TransferRow
          key={transfer.id}
          equipmentName={transfer.equipmentName}
          destinationName={transfer.destinationName}
          isDelayed={transfer.isDelayed}
          status={transfer.status}
          notes={transfer.notes}
        />
      ))}
    </div>
  )
}

export default TransfersPage;
