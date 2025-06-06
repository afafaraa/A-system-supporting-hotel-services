import { useState, useEffect } from 'react';
import { axiosAuthApi } from "../../../middleware/axiosApi.ts";
import { Button, Typography } from "@mui/material";
import { ServiceProps } from "../available-services/AvailableServiceCard.tsx";

type ScheduleProps = {
  id: string;
  serviceId: string;
  employeeId: string;
  active: boolean;
  serviceDate: Date;
  weekday: Weekday;
  inCart: boolean;
};

enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

const weekdayMap: Record<string, Weekday> = {
  M: Weekday.MONDAY,
  T: Weekday.TUESDAY,
  W: Weekday.WEDNESDAY,
  Th: Weekday.THURSDAY,
  F: Weekday.FRIDAY,
  S: Weekday.SATURDAY,
  Su: Weekday.SUNDAY,
};

const dayLetters = Object.keys(weekdayMap);

function ScheduleForDate({ service }: { service: ServiceProps }) {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleProps[]>([]);
  const [day, setDay] = useState<string>(dayLetters[(new Date().getDay() + 6) % 7]);
  const [weekMonday, setWeekMonday] = useState<Date>(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday;
  });

  useEffect(() => {
    fetchSchedule();
  }, [service.id, weekMonday]);

  const addToCart = async (item: ScheduleProps) => {
    let cartItemIdList: string[];

    const stringifiedItems = localStorage.getItem("CART");
    if( stringifiedItems ) {
      const parsedItemIds: string[] = JSON.parse(stringifiedItems);
      if ( parsedItemIds.indexOf(item.id) === -1 ) {
        cartItemIdList = [...JSON.parse(stringifiedItems), item.id];
        localStorage.setItem("CART", JSON.stringify(cartItemIdList));
      }
    } else {
      cartItemIdList = [item.id];
      localStorage.setItem("CART", JSON.stringify(cartItemIdList));
    }
    setSchedule(schedule.map(s =>
      s.id === item.id ? { ...item, inCart: true } : s
    ));
  };

  const removeFromCart = async (item: ScheduleProps) => {
    const stringifiedItems = localStorage.getItem("CART");
    if( stringifiedItems ) {
      let parsedItemIds: string[] = JSON.parse(stringifiedItems);
      if ( parsedItemIds.indexOf(item.id) !== -1 ) {
        parsedItemIds = parsedItemIds.filter((e: string) => {
          return e !== item.id
        });
        localStorage.setItem("CART", JSON.stringify(parsedItemIds));
      }
    }
    setSchedule(schedule.map(s =>
      s.id === item.id ? { ...item, inCart: false } : s
    ));
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await axiosAuthApi(`/schedule/get/week/id/${service.id}`, {
        params: { date: weekMonday },
      });
      const stringifiedItems = localStorage.getItem("CART");
      let parsedItemIds: string[] = [];
      if( stringifiedItems ) {
        parsedItemIds = JSON.parse(stringifiedItems);
      }
      const scheduleItems = response.data.map((s: ScheduleProps) => {
        return {...s, inCart: parsedItemIds.includes(s.id) };
      });
      setSchedule(scheduleItems);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const changeWeek = async (next: boolean) => {
    setWeekMonday(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (next ? 7 : -7));
      return newDate;
    });
    await fetchSchedule();
  };

  const formatEndOfWeek = () => {
    const weekEnd = new Date(weekMonday);
    weekEnd.setDate(weekMonday.getDate() + 6);
    return weekEnd.toDateString();
  };

  const selectedWeekday = weekdayMap[day];

  if (loading) {
    return <p>Loading...</p>;
  }
  const filteredSchedule = schedule.filter((item) => item.weekday === selectedWeekday);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: '1em', color: '#555555' }}>
        {weekMonday.toDateString()} - {formatEndOfWeek()}
      </p>
      <div style={{ display: 'flex', gap: '5px' }}>
        <Button onClick={() => changeWeek(false)} sx={{ minWidth: 'auto', width: '37px', borderRadius: '100%' }}>{'<'}</Button>
        {dayLetters.map((currDay) => (
          <Button
            key={currDay}
            onClick={() => setDay(currDay)}
            sx={{
              minWidth: 'auto',
              width: '37px',
              height: '37px',
              borderRadius: '100%',
              background: currDay === day ? 'black' : '',
              color: currDay === day ? 'white' : '',
            }}
          >
            {currDay}
          </Button>
        ))}
        <Button onClick={() => changeWeek(true)} sx={{ minWidth: 'auto', width: '37px', borderRadius: '100%' }}>{'>'}</Button>
      </div>
      {filteredSchedule.length === 0 ? (
        <Typography>No services available for this day.</Typography>
      ) : (
        filteredSchedule.map((item) => (
          <div key={item.id} style={{ display: 'flex' }}>
            <Typography sx={{ padding: '10px 15px', borderRadius: '10px', width: '70%' }}>
              {JSON.stringify(item.id)}
            </Typography>
            {item.inCart ? (<Button onClick={() => removeFromCart(item)} sx={{ minWidth: 'auto', width: '50px' }}>
              -
            </Button>) : (<Button onClick={() => addToCart(item)} sx={{ minWidth: 'auto', width: '50px' }}>
              +
            </Button>)}

          </div>
        ))
      )}

    </div>
  );
}

export default ScheduleForDate;
