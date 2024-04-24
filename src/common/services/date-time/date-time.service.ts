import { Injectable } from '@nestjs/common';
import { DateTime, DateTimeFormatOptions, Info, Settings } from 'luxon';

@Injectable()
export class DateTimeService {
  // var timeZoneIanaString = "Asia/Kolkata";

  getDateTime(timeZoneIanaString: string) {
    return DateTime.local({
      zone: timeZoneIanaString,
    }).toFormat('yyyy-MM-dd TT');
  }

  getDate(timeZoneIanaString: string) {
    return DateTime.local({ zone: timeZoneIanaString }).toFormat('yyyy-MM-dd');
  }

  getTime(timeZoneIanaString: string) {
    return DateTime.local({ zone: timeZoneIanaString }).toFormat('TT');
  }
}
