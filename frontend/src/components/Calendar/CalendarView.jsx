import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import './CalendarView.css';

const CalendarView = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="calendar-actions">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>{'<'}</button>
          <button onClick={() => setCurrentMonth(today)}>Today</button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>{'>'}</button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Monday start

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="calendar-day-name" key={i}>
          {format(addDays(weekStart, i), 'EEE')}
        </div>
      );
    }

    return <div className="calendar-days">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const taskCount = tasks.filter(task => isSameDay(new Date(task.startDate), cloneDay)).length;

        days.push(
          <div
            className={`calendar-cell ${
              !isSameMonth(cloneDay, monthStart) ? 'disabled' : ''
            } ${isSameDay(cloneDay, today) ? 'today' : ''}`}
            key={cloneDay}
          >
            <span>{format(cloneDay, 'd')}</span>
            {taskCount > 0 && (
              <span className="task-dot" title={`${taskCount} task(s)`}></span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="calendar-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CalendarView;

