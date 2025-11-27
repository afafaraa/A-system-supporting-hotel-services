import {axiosAuthApi} from "../middleware/axiosApi.ts";
import {SimpleReservation, SimpleSchedule} from "../components/ui/BillElementCard.tsx";
import {BillElement} from "../types/userDetails.ts";

async function fetchBillElementsData(billElements: BillElement[]): Promise<{schedulesRecord: Record<string, SimpleSchedule> | null, reservationsRecord: Record<string, SimpleReservation> | null}> {
  if (!billElements || billElements.length === 0) {
    return { schedulesRecord: null as Record<string, SimpleSchedule> | null, reservationsRecord: null as Record<string, SimpleReservation> | null };
  }

  const scheduleIds = billElements.filter(e => e.type === "SERVICE").map(e => e.id);
  const reservationIds = billElements.filter(e => e.type === "RESERVATION").map(e => e.id);

  const schedulePromise = scheduleIds.length
    ? axiosAuthApi.get<SimpleSchedule[]>('/schedule/for-transactions-history', { params: { ids: scheduleIds.toString() } })
    : Promise.resolve({ data: [] } as { data: SimpleSchedule[] });

  const reservationPromise = reservationIds.length
    ? axiosAuthApi.get<SimpleReservation[]>('/reservations/by-ids', { params: { ids: reservationIds.toString() } })
    : Promise.resolve({ data: [] } as { data: SimpleReservation[] });

  const [sRes, rRes] = await Promise.all([schedulePromise, reservationPromise]);

  const schedulesRecord: Record<string, SimpleSchedule> | null =
    sRes.data.length > 0 ? Object.fromEntries(sRes.data.map(s => [s.id, { ...s, type: 'SERVICE' }])) : null;

  const reservationsRecord: Record<string, SimpleReservation> | null =
    rRes.data.length > 0 ? Object.fromEntries(rRes.data.map(r => [r.id, { ...r, type: 'RESERVATION' }])) : null;

  return { schedulesRecord, reservationsRecord };
}

export default fetchBillElementsData;
