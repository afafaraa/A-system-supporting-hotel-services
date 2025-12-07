import {axiosAuthApi} from "../middleware/axiosApi.ts";
import {SimpleReservation, SimpleSchedule} from "../components/ui/BillElementCard.tsx";
import {BillElement} from "../types/userDetails.ts";

async function fetchBillElementsData(billElements: BillElement[]): Promise<{schedulesRecord: Record<string, SimpleSchedule> | null, reservationsRecord: Record<string, SimpleReservation> | null}> {
  if (billElements.length === 0) {
    return { schedulesRecord: null, reservationsRecord: null };
  }

  const scheduleIds = billElements.filter(e => e.type === "SERVICE").map(e => e.id);
  const reservationIds = billElements.filter(e => e.type === "RESERVATION").map(e => e.id);

  const schedulePromise: Promise<{ data: SimpleSchedule[] }> = scheduleIds.length
    ? axiosAuthApi.get<SimpleSchedule[]>('/schedule/for-transactions-history', { params: { ids: scheduleIds.join(',') } })
    : Promise.resolve({ data: [] });

  const reservationPromise: Promise<{ data: SimpleReservation[] }> = reservationIds.length
    ? axiosAuthApi.get<SimpleReservation[]>('/reservations/by-ids', { params: { ids: reservationIds.join(',') } })
    : Promise.resolve({ data: [] });

  const [sRes, rRes] = await Promise.all([schedulePromise, reservationPromise]);

  const schedulesRecord: Record<string, SimpleSchedule> | null =
    sRes.data.length > 0 ? Object.fromEntries(sRes.data.map(s => [s.id, { ...s, type: 'SERVICE' }])) : null;

  const reservationsRecord: Record<string, SimpleReservation> | null =
    rRes.data.length > 0 ? Object.fromEntries(rRes.data.map(r => [r.id, { ...r, type: 'RESERVATION' }])) : null;

  return { schedulesRecord, reservationsRecord };
}

export default fetchBillElementsData;
