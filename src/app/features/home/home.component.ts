import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CronOptions } from 'src/app/shared/utilitary/CronOptions';
import { Days, Months, MonthWeeks } from 'src/app/shared/utilitary/enums';
import Utils from 'src/app/shared/utilitary/Utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Input() public disabled: boolean;
  @Input() public options: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',

    defaultTime: '10:00:00',
    use24HourTime: true,

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,

    hideSeconds: false,
    removeSeconds: false,
    removeYears: false
  };;


  @Input() get cron(): string {
    return this.localCron;
  }
  set cron(value: string) {
    this.localCron = value;
    this.cronChange.emit(this.localCron);
    this.onChange(value);
  }

  // @Input() get cron(): string { return this.localCron; }
  // set cron(value: string) {
  //   this.localCron = value;
  //   this.onChange(value);
  // }

  // the name is an Angular convention, @Input variable name + "Change" suffix
  @Output() cronChange = new EventEmitter();
  
  public activeTab: string;
  public selectOptions = this.getSelectOptions();
  public state: any;
  tabIndex = 0;

  private localCron :string = '0 3 12 ? * MON-FRI *';

  private isDirty: boolean;


  cronForm: FormControl;


  get cron_string() { return this.cronForm.value; }

  minutesForm: FormGroup;
  hourlyForm: FormGroup;
  dailyForm: FormGroup;
  weeklyForm: FormGroup;
  monthlyForm: FormGroup;
  yearlyForm: FormGroup;
  advancedForm: FormGroup;

  constructor(private fb: FormBuilder) {}


  /* Update the cron output to that of the selected tab.
   * The cron output value is updated whenever a form is updated. To make it change in response to tab selection, we simply reset
   * the value of the form that goes into focus. */
  public onTabFocus(tabOption: any) {
    const idx : number = tabOption[0].index;
    switch (idx) {
      case 0:
        this.minutesForm.setValue(this.minutesForm.value);
        break;
      case 1:
        this.hourlyForm.setValue(this.hourlyForm.value);
        break;
      case 2:
        this.dailyForm.setValue(this.dailyForm.value);
        break;
      case 3:
        this.weeklyForm.setValue(this.weeklyForm.value);
        break;
      case 4:
        this.monthlyForm.setValue(this.monthlyForm.value);
        break;
      case 5:
        this.yearlyForm.setValue(this.yearlyForm.value);
        break;
      case 6:
        this.advancedForm.setValue(this.advancedForm.value);
        break;
      default:
        throw(new Error('Invalid tab selected'));
    }
  }

  async ngOnInit() {
    if (this.options.removeSeconds) {
      this.options.hideSeconds = true;
    }

    this.state = this.getDefaultState();

    if (!this.cron) {
      this.cron = '0 0/1 * 1/1 * ? *';
    }

    this.handleModelChange(this.cron);

    const [defaultHours, defaultMinutes, defaultSeconds] = this.options.defaultTime.split(':').map(Number);

    this.cronForm = new FormControl(this.cron);

    this.minutesForm = this.fb.group({
      minutes: [this.state.minutes.minutes],
      seconds: [this.state.minutes.seconds]
    });
    this.minutesForm.valueChanges.subscribe(value => this.computeMinutesCron(value));

    this.hourlyForm = this.fb.group({
      hours: [this.state.hourly.hours],
      minutes: [this.state.hourly.minutes],
      seconds: [this.state.hourly.seconds]
    });
    this.hourlyForm.valueChanges.subscribe(value => this.computeHourlyCron(value));


    this.dailyForm = this.fb.group({
      subTab: [this.state.daily.subTab],
      everyDays: this.fb.group({
        days: [this.state.daily.everyDays.days],
        hours: [this.state.daily.everyDays.hours],
        minutes: [this.state.daily.everyDays.minutes],
        seconds: [this.state.daily.everyDays.seconds],
        hourType: [this.getHourType(0)]
      }),
      everyWeekDay: this.fb.group({
        days: [0],
        hours: [this.state.daily.everyWeekDay.hours],
        minutes: [this.state.daily.everyWeekDay.minutes],
        seconds: [this.state.daily.everyWeekDay.seconds],
        hourType: [this.getHourType(0)]
      })
    });
    this.dailyForm.valueChanges.subscribe(value => this.computeDailyCron(value));

    this.weeklyForm = this.fb.group({
      MON: [true],
      TUE: [false],
      WED: [false],
      THU: [false],
      FRI: [false],
      SAT: [false],
      SUN: [false],
      hours: [this.getAmPmHour(defaultHours)],
      minutes: [defaultMinutes],
      seconds: [defaultSeconds],
      hourType: [this.getHourType(defaultHours)]
    });
    this.weeklyForm.valueChanges.subscribe(next => this.computeWeeklyCron(next));

    this.monthlyForm = this.fb.group({
      subTab: [this.state.monthly.subTab],
      runOnWeekday : [false],
      specificDay: this.fb.group({
        day: [this.state.monthly.specificDay.day],
        months: [this.state.monthly.specificDay.months],
        hours: [this.state.monthly.specificDay.hours],
        minutes: [this.state.monthly.specificDay.minutes],
        seconds: [this.state.monthly.specificDay.seconds],
        hourType: [this.getHourType(defaultHours)]
      }),
      specificWeekDay: this.fb.group({
        monthWeek: [this.state.monthly.specificWeekDay.monthWeek],
        day: [this.state.monthly.specificWeekDay.day],
        months: [this.state.monthly.specificWeekDay.months],
        startMonth: [1],
        hours: [this.state.monthly.specificWeekDay.hours],
        minutes: [this.state.monthly.specificWeekDay.minutes],
        seconds: [this.state.monthly.specificWeekDay.seconds],
        hourType: [this.getHourType(defaultHours)]
      })
    });
    this.monthlyForm.valueChanges.subscribe(next => this.computeMonthlyCron(next));

    this.yearlyForm = this.fb.group({
      subTab: [this.state.yearly.subTab],
      runOnWeekday : [false],
      specificMonthDay: this.fb.group({
        month: [this.state.yearly.specificMonthDay.month],
        day: [this.state.yearly.specificMonthDay.day],
        hours: [this.state.yearly.specificMonthDay.hours],
        minutes: [this.state.yearly.specificMonthDay.minutes],
        seconds: [this.state.yearly.specificMonthDay.seconds],
        hourType: [this.getHourType(defaultHours)]
      }),
      specificMonthWeek: this.fb.group({
        monthWeek: [this.state.yearly.specificMonthWeek.monthWeek],
        day: [this.state.yearly.specificMonthWeek.day],
        month: [this.state.yearly.specificMonthWeek.month],
        hours: [this.state.yearly.specificMonthWeek.hours],
        minutes: [this.state.yearly.specificMonthWeek.minutes],
        seconds: [this.state.yearly.specificMonthWeek.seconds],
        hourType: [this.getHourType(defaultHours)]
      })
    });
    this.yearlyForm.valueChanges.subscribe(next => this.computeYearlyCron(next));

    this.advancedForm = this.fb.group({
      expression: [this.state.advanced.expression]
    });
    this.advancedForm.controls.expression.valueChanges.subscribe(next => this.computeAdvancedExpression(next));
  }

  tabSelectChange(tabOption: any): void {
    console.log('TAB :', tabOption);
    this.tabIndex = tabOption[0].index;
  }

  setIndexTab(index: number): void{
    this.tabIndex = index;
  }

  public ngOnChanges(changes: SimpleChanges) {
    const newCron = changes['cron'];
    if (newCron && !newCron.firstChange) {
      this.handleModelChange(this.cron);
    }
  }

  public setActiveTab(tab: string) {
    if (!this.disabled) {
      this.activeTab = tab;
      this.regenerateCron();
    }
  }
  
  public dayDisplay(day: string): string {
    return Days[day];
  }

  public monthWeekDisplay(monthWeekNumber: number): string {
    return MonthWeeks[monthWeekNumber];
  }

  public monthDisplay(month: number): string {
    return Months[month];
  }

  public monthDayDisplay(month: string): string {
    if (month === 'L') {
      return 'Último';
    } else if (month === 'LW') {
      return 'Último día de la semana';
    } else if (month === '1W') {
      return 'Primer día de la semana';
    } else {
      return `${month}${this.getOrdinalSuffix(month)} día`;
    }
  }

  private computeMinutesCron(state: any) {
    this.cron = `0/${state.minutes} * 1/1 * ?`;

    if (!this.options.removeSeconds) {
      this.cron = `${state.seconds} ${this.cron}`;
    }

    if (!this.options.removeYears) {
      this.cron = `${this.cron} *`;
    }

    this.cronForm.setValue(this.cron);
  }

  private computeHourlyCron(state: any) {
    this.cron = `${state.minutes} 0/${state.hours} 1/1 * ?`;

    if (!this.options.removeSeconds) {
      this.cron = `${state.seconds} ${this.cron}`;
    }

    if (!this.options.removeYears) {
      this.cron = `${this.cron} *`;
    }

    this.cronForm.setValue(this.cron);
  }

  private computeDailyCron(state: any) {
    switch (state.subTab) {
      case 'everyDays':
        this.cron = `${state.everyDays.minutes} ${this.hourToCron(state.everyDays.hours, state.everyDays.hourTypee)} 1/${state.everyDays.days} * ?`;

        if (!this.options.removeSeconds) {
          this.cron = `${state.everyDays.seconds} ${this.cron}`;
        }

        if (!this.options.removeYears) {
          this.cron = `${this.cron} *`;
        }
        break;
      case 'everyWeekDay':
        this.cron = `${state.everyWeekDay.minutes} ${this.hourToCron(state.everyWeekDay.hours, state.everyWeekDay.hourType)} ? * MON-FRI`;

            if (!this.options.removeSeconds) {
              this.cron = `${state.everyWeekDay.seconds} ${this.cron}`;
            }

            if (!this.options.removeYears) {
              this.cron = `${this.cron} *`;
            }
        break;
      default:
        throw new Error('Invalid cron daily subtab selection');
    }
    this.cronForm.setValue(this.cron);
  }

  private computeWeeklyCron(state: any) {
    const days = this.selectOptions.days
          .reduce((acc, day) => state[day] ? acc.concat([day]) : acc, [])
          .join(',');
        this.cron = `${state.minutes} ${this.hourToCron(state.hours, state.hourType)} ? * ${days}`;

        if (!this.options.removeSeconds) {
          this.cron = `${state.seconds} ${this.cron}`;
        }

        if (!this.options.removeYears) {
          this.cron = `${this.cron} *`;
        }
    this.cronForm.setValue(this.cron);
  }

  private computeMonthlyCron(state: any) {
    switch (state.subTab) {
      case 'specificDay':
        const day = state.runOnWeekday ? `${state.specificDay.day}W` : state.specificDay.day;
        // tslint:disable-next-line:max-line-length
        this.cron = `${state.specificDay.minutes} ${this.hourToCron(state.specificDay.hours, state.specificDay.hourType)} ${day} 1/${state.specificDay.months} ?`;

        if (!this.options.removeSeconds) {
          this.cron = `${state.specificDay.seconds} ${this.cron}`;
        }

        if (!this.options.removeYears) {
          this.cron = `${this.cron} *`;
        }
        break;
      case 'specificWeekDay':
        this.cron = `${state.specificWeekDay.minutes} ${this.hourToCron(state.specificWeekDay.hours, state.specificWeekDay.hourType)} ? ${state.specificWeekDay.startMonth}/${state.specificWeekDay.months} ${state.specificWeekDay.day}${state.specificWeekDay.monthWeek}`;

            if (!this.options.removeSeconds) {
              this.cron = `${state.specificWeekDay.seconds} ${this.cron}`;
            }

            if (!this.options.removeYears) {
              this.cron = `${this.cron} *`;
            }
        break;
      default:
        throw new Error('Invalid cron montly subtab selection');
    }
    this.cronForm.setValue(this.cron);
  }

  private computeYearlyCron(state: any) {
    switch (state.subTab) {
      case 'specificMonthDay':
        // tslint:disable-next-line:max-line-length
        const day = state.runOnWeekday ? `${state.specificMonthDay.day}W` : state.specificMonthDay.day;
        // tslint:disable-next-line:max-line-length
        this.cron = `${state.specificMonthDay.minutes} ${this.hourToCron(state.specificMonthDay.hours, state.specificMonthDay.hourType)} ${day} ${state.specificMonthDay.month} ?`;

        if (!this.options.removeSeconds) {
          this.cron = `${state.specificMonthDay.seconds} ${this.cron}`;
        }

        if (!this.options.removeYears) {
          this.cron = `${this.cron} *`;
        }
        break;
      case 'specificMonthWeek':
         // tslint:disable-next-line:max-line-length
         this.cron = `${state.specificMonthWeek.minutes} ${this.hourToCron(state.specificMonthWeek.hours, state.specificMonthWeek.hourType)} ? ${state.specificMonthWeek.month} ${state.specificMonthWeek.day}${state.specificMonthWeek.monthWeek}`;

         if (!this.options.removeSeconds) {
           this.cron = `${state.specificMonthWeek.seconds} ${this.cron}`;
         }

         if (!this.options.removeYears) {
           this.cron = `${this.cron} *`;
         }
        break;
      default:
        throw new Error('Invalid cron yearly subtab selection');
    }
    this.cronForm.setValue(this.cron);
  }

  private computeAdvancedExpression(expression: any) {
    this.cron = expression;
    this.cronForm.setValue(this.cron);
  }

  public regenerateCron() {
    console.log('Se Ejecuto')
    this.isDirty = true;

    switch (this.activeTab) {
      case 'minutes':
        this.cron = `0/${this.state.minutes.minutes} * 1/1 * ?`;

        if (!this.options.removeSeconds) {
          this.cron = `${this.state.minutes.seconds} ${this.cron}`;
        }

        if (!this.options.removeYears) {
          this.cron = `${this.cron} *`;
        }
        break;
      case 'hourly':
        this.cron = `${this.state.hourly.minutes} 0/${this.state.hourly.hours} 1/1 * ?`;

        if (!this.options.removeSeconds) {
          this.cron = `${this.state.hourly.seconds} ${this.cron}`;
        }

        if (!this.options.removeYears) {
          this.cron = `${this.cron} *`;
        }
        break;
      case 'daily':
        switch (this.state.daily.subTab) {
          case 'everyDays':
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.daily.everyDays.minutes} ${this.hourToCron(this.state.daily.everyDays.hours, this.state.daily.everyDays.hourType)} 1/${this.state.daily.everyDays.days} * ?`;

            if (!this.options.removeSeconds) {
              this.cron = `${this.state.daily.everyDays.seconds} ${this.cron}`;
            }

            if (!this.options.removeYears) {
              this.cron = `${this.cron} *`;
            }
            break;
          case 'everyWeekDay':
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.daily.everyWeekDay.minutes} ${this.hourToCron(this.state.daily.everyWeekDay.hours, this.state.daily.everyWeekDay.hourType)} ? * MON-FRI`;

            if (!this.options.removeSeconds) {
              this.cron = `${this.state.daily.everyWeekDay.seconds} ${this.cron}`;
            }

            if (!this.options.removeYears) {
              this.cron = `${this.cron} *`;
            }
            break;
          default:
            throw new Error('Invalid cron daily subtab selection');
        }
        break;
      case 'weekly':
        const days = this.selectOptions.days
          .reduce((acc, day) => this.state.weekly[day] ? acc.concat([day]) : acc, [])
          .join(',');
        this.cron = `${this.state.weekly.minutes} ${this.hourToCron(this.state.weekly.hours, this.state.weekly.hourType)} ? * ${days}`;

        if (!this.options.removeSeconds) {
          this.cron = `${this.state.weekly.seconds} ${this.cron}`;
        }

        if (!this.options.removeYears) {
          this.cron = `${this.cron} *`;
        }
        break;
      case 'monthly':
        switch (this.state.monthly.subTab) {
          case 'specificDay':
            const day = this.state.monthly.runOnWeekday ? `${this.state.monthly.specificDay.day}W` : this.state.monthly.specificDay.day;
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.monthly.specificDay.minutes} ${this.hourToCron(this.state.monthly.specificDay.hours, this.state.monthly.specificDay.hourType)} ${day} 1/${this.state.monthly.specificDay.months} ?`;

            if (!this.options.removeSeconds) {
              this.cron = `${this.state.monthly.specificDay.seconds} ${this.cron}`;
            }

            if (!this.options.removeYears) {
              this.cron = `${this.cron} *`;
            }
            break;
          case 'specificWeekDay':
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.monthly.specificWeekDay.minutes} ${this.hourToCron(this.state.monthly.specificWeekDay.hours, this.state.monthly.specificWeekDay.hourType)} ? ${this.state.monthly.specificWeekDay.startMonth}/${this.state.monthly.specificWeekDay.months} ${this.state.monthly.specificWeekDay.day}${this.state.monthly.specificWeekDay.monthWeek}`;

            if (!this.options.removeSeconds) {
              this.cron = `${this.state.monthly.specificWeekDay.seconds} ${this.cron}`;
            }

            if (!this.options.removeYears) {
              this.cron = `${this.cron} *`;
            }
            break;
          default:
            throw new Error('Invalid cron monthly subtab selection');
        }
        break;
      case 'yearly':
        switch (this.state.yearly.subTab) {
          case 'specificMonthDay':
            // tslint:disable-next-line:max-line-length
            const day = this.state.yearly.runOnWeekday ? `${this.state.yearly.specificMonthDay.day}W` : this.state.yearly.specificMonthDay.day;
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.yearly.specificMonthDay.minutes} ${this.hourToCron(this.state.yearly.specificMonthDay.hours, this.state.yearly.specificMonthDay.hourType)} ${day} ${this.state.yearly.specificMonthDay.month} ?`;

            if (!this.options.removeSeconds) {
              this.cron = `${this.state.yearly.specificMonthDay.seconds} ${this.cron}`;
            }

            if (!this.options.removeYears) {
              this.cron = `${this.cron} *`;
            }
            break;
          case 'specificMonthWeek':
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.yearly.specificMonthWeek.minutes} ${this.hourToCron(this.state.yearly.specificMonthWeek.hours, this.state.yearly.specificMonthWeek.hourType)} ? ${this.state.yearly.specificMonthWeek.month} ${this.state.yearly.specificMonthWeek.day}${this.state.yearly.specificMonthWeek.monthWeek}`;

            if (!this.options.removeSeconds) {
              this.cron = `${this.state.yearly.specificMonthWeek.seconds} ${this.cron}`;
            }

            if (!this.options.removeYears) {
              this.cron = `${this.cron} *`;
            }
            break;
          default:
            throw new Error('Invalid cron yearly subtab selection');
        }
        break;
      case 'advanced':
        this.cron = this.state.advanced.expression;
        break;
      default:
        throw new Error('Invalid cron active tab selection');
    }
  }

  private getAmPmHour(hour: number) {
    return this.options.use24HourTime ? hour : (hour + 11) % 12 + 1;
  }

  private getHourType(hour: number) {
    return this.options.use24HourTime ? undefined : (hour >= 12 ? 'PM' : 'AM');
  }

  private hourToCron(hour: number, hourType: string) {
    if (this.options.use24HourTime) {
      return hour;
    } else {
      return hourType === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    }
  }

  private handleModelChange(cron: string) {
    if (this.isDirty) {
      this.isDirty = false;
      return;
    } else {
      this.isDirty = false;
    }

    this.validate(cron);

    let cronSeven = cron;
    if (this.options.removeSeconds) {
      cronSeven = `0 ${cron}`;
    }

    if (this.options.removeYears) {
      cronSeven = `${cronSeven} *`;
    }

    const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = cronSeven.split(' ');

    if (cronSeven.match(/\d+ 0\/\d+ \* 1\/1 \* \? \*/)) {
      this.activeTab = 'minutes';

      this.state.minutes.minutes = Number(minutes.substring(2));
      this.state.minutes.seconds = Number(seconds);
      this.setIndexTab(0);
    } else if (cronSeven.match(/\d+ \d+ 0\/\d+ 1\/1 \* \? \*/)) {
      this.activeTab = 'hourly';

      this.state.hourly.hours = Number(hours.substring(2));
      this.state.hourly.minutes = Number(minutes);
      this.state.hourly.seconds = Number(seconds);
      this.setIndexTab(1);
    } else if (cronSeven.match(/\d+ \d+ \d+ 1\/\d+ \* \? \*/)) {
      this.activeTab = 'daily';

      this.state.daily.subTab = 'everyDays';
      this.state.daily.everyDays.days = Number(dayOfMonth.substring(2));
      const parsedHours = Number(hours);
      this.state.daily.everyDays.hours = this.getAmPmHour(parsedHours);
      this.state.daily.everyDays.hourType = this.getHourType(parsedHours);
      this.state.daily.everyDays.minutes = Number(minutes);
      this.state.daily.everyDays.seconds = Number(seconds);
      this.setIndexTab(2);
    } else if (cronSeven.match(/\d+ \d+ \d+ \? \* MON-FRI \*/)) {
      this.activeTab = 'daily';

      this.state.daily.subTab = 'everyWeekDay';
      const parsedHours = Number(hours);
      this.state.daily.everyWeekDay.hours = this.getAmPmHour(parsedHours);
      this.state.daily.everyWeekDay.hourType = this.getHourType(parsedHours);
      this.state.daily.everyWeekDay.minutes = Number(minutes);
      this.state.daily.everyWeekDay.seconds = Number(seconds);
      this.setIndexTab(2);
    } else if (cronSeven.match(/\d+ \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      this.activeTab = 'weekly';
      this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
      dayOfWeek.split(',').forEach(weekDay => this.state.weekly[weekDay] = true);
      const parsedHours = Number(hours);
      this.state.weekly.hours = this.getAmPmHour(parsedHours);
      this.state.weekly.hourType = this.getHourType(parsedHours);
      this.state.weekly.minutes = Number(minutes);
      this.state.weekly.seconds = Number(seconds);
      this.setIndexTab(3);
    } else if (cronSeven.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ \? \*/)) {
      this.activeTab = 'monthly';
      this.state.monthly.subTab = 'specificDay';

      if (dayOfMonth.indexOf('W') !== -1) {
        this.state.monthly.specificDay.day = dayOfMonth.charAt(0);
        this.state.monthly.runOnWeekday = true;
      } else {
        this.state.monthly.specificDay.day = dayOfMonth;
      }

      this.state.monthly.specificDay.months = Number(month.substring(2));
      const parsedHours = Number(hours);
      this.state.monthly.specificDay.hours = this.getAmPmHour(parsedHours);
      this.state.monthly.specificDay.hourType = this.getHourType(parsedHours);
      this.state.monthly.specificDay.minutes = Number(minutes);
      this.state.monthly.specificDay.seconds = Number(seconds);
      this.setIndexTab(4);
    } else if (cronSeven.match(/\d+ \d+ \d+ \? \d+\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
      const day = dayOfWeek.substr(0, 3);
      const monthWeek = dayOfWeek.substr(3);
      this.activeTab = 'monthly';
      this.state.monthly.subTab = 'specificWeekDay';
      this.state.monthly.specificWeekDay.monthWeek = monthWeek;
      this.state.monthly.specificWeekDay.day = day;

      if (month.indexOf('/') !== -1) {
        const [startMonth, months] = month.split('/').map(Number);
        this.state.monthly.specificWeekDay.months = months;
        this.state.monthly.specificWeekDay.startMonth = startMonth;
      }

      const parsedHours = Number(hours);
      this.state.monthly.specificWeekDay.hours = this.getAmPmHour(parsedHours);
      this.state.monthly.specificWeekDay.hourType = this.getHourType(parsedHours);
      this.state.monthly.specificWeekDay.minutes = Number(minutes);
      this.state.monthly.specificWeekDay.seconds = Number(seconds);
      this.setIndexTab(4);
    } else if (cronSeven.match(/\d+ \d+ \d+ (\d+|L|LW|1W) \d+ \? \*/)) {
      this.activeTab = 'yearly';
      this.state.yearly.subTab = 'specificMonthDay';
      this.state.yearly.specificMonthDay.month = Number(month);

      if (dayOfMonth.indexOf('W') !== -1) {
        this.state.yearly.specificMonthDay.day = dayOfMonth.charAt(0);
        this.state.yearly.runOnWeekday = true;
      } else {
        this.state.yearly.specificMonthDay.day = dayOfMonth;
      }

      const parsedHours = Number(hours);
      this.state.yearly.specificMonthDay.hours = this.getAmPmHour(parsedHours);
      this.state.yearly.specificMonthDay.hourType = this.getHourType(parsedHours);
      this.state.yearly.specificMonthDay.minutes = Number(minutes);
      this.state.yearly.specificMonthDay.seconds = Number(seconds);
      this.setIndexTab(5);
    } else if (cronSeven.match(/\d+ \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
      const day = dayOfWeek.substr(0, 3);
      const monthWeek = dayOfWeek.substr(3);
      this.activeTab = 'yearly';
      this.state.yearly.subTab = 'specificMonthWeek';
      this.state.yearly.specificMonthWeek.monthWeek = monthWeek;
      this.state.yearly.specificMonthWeek.day = day;
      this.state.yearly.specificMonthWeek.month = Number(month);
      const parsedHours = Number(hours);
      this.state.yearly.specificMonthWeek.hours = this.getAmPmHour(parsedHours);
      this.state.yearly.specificMonthWeek.hourType = this.getHourType(parsedHours);
      this.state.yearly.specificMonthWeek.minutes = Number(minutes);
      this.state.yearly.specificMonthWeek.seconds = Number(seconds);
      this.setIndexTab(5);
    } else {
      this.activeTab = 'advanced';
      this.state.advanced.expression = cron;
      this.setIndexTab(5);
    }
  }

  private validate(cron: string): void {
    this.state.validation.isValid = false;
    this.state.validation.errorMessage = '';

    if (!cron) {
      this.state.validation.errorMessage = 'Cron expression cannot be null';
      return;
    }

    const cronParts = cron.split(' ');

    let expected = 5;

    if (!this.options.removeSeconds) {
      expected++;
    }

    if (!this.options.removeYears) {
      expected++;
    }

    if (cronParts.length !== expected) {
      this.state.validation.errorMessage = `Invalid cron expression, there must be ${expected} segments`;
      return;
    }

    this.state.validation.isValid = true;
    return;
  }

  private getDefaultAdvancedCronExpression(): string {
    if (this.options.removeSeconds && !this.options.removeYears) {
      return '15 10 L-2 * ? 2019';
    }

    if (!this.options.removeSeconds && this.options.removeYears) {
      return '0 15 10 L-2 * ?';
    }

    if (this.options.removeSeconds && this.options.removeYears) {
      return '15 10 L-2 * ?';
    }

    return '0 15 10 L-2 * ? 2019';
  }

  private getDefaultState() {
    const [defaultHours, defaultMinutes, defaultSeconds] = this.options.defaultTime.split(':').map(Number);

    return {
      minutes: {
        minutes: 1,
        seconds: 0
      },
      hourly: {
        hours: 1,
        minutes: 0,
        seconds: 0
      },
      daily: {
        subTab: 'everyDays',
        everyDays: {
          days: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        },
        everyWeekDay: {
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        }
      },
      weekly: {
        MON: true,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false,
        hours: this.getAmPmHour(defaultHours),
        minutes: defaultMinutes,
        seconds: defaultSeconds,
        hourType: this.getHourType(defaultHours)
      },
      monthly: {
        subTab: 'specificDay',
        runOnWeekday: false,
        specificDay: {
          day: '1',
          months: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        },
        specificWeekDay: {
          monthWeek: '#1',
          day: 'MON',
          startMonth: 1,
          months: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        }
      },
      yearly: {
        subTab: 'specificMonthDay',
        runOnWeekday: false,
        specificMonthDay: {
          month: 1,
          day: '1',
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        },
        specificMonthWeek: {
          monthWeek: '#1',
          day: 'MON',
          month: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        }
      },
      advanced: {
        expression: this.getDefaultAdvancedCronExpression()
      },
      validation: {
        isValid: true,
        errorMessage: ''
      }
    };
  }

  private getOrdinalSuffix(value: string) {
    if (value.length > 1) {
      const secondToLastDigit = value.charAt(value.length - 2);
      if (secondToLastDigit === '1') {
        return 'th';
      }
    }

    const lastDigit = value.charAt(value.length - 1);
    switch (lastDigit) {
      case '1':
        return 'st';
      case '2':
        return 'nd';
      case '3':
        return 'rd';
      default:
        return 'th';
    }
  }

  private getSelectOptions() {
    return {
      months: Utils.getRange(1, 12),
      monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
      days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      minutes: Utils.getRange(0, 59),
      fullMinutes: Utils.getRange(0, 59),
      seconds: Utils.getRange(0, 59),
      hours: Utils.getRange(1, 23),
      monthDays: Utils.getRange(1, 31),
      monthDaysWithLasts: [...Utils.getRange(1, 31).map(String), 'L'],
      hourTypes: ['AM', 'PM']
    };
  }

   /*
   * ControlValueAccessor
   */
  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  writeValue(obj: string): void {
    this.cron = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
}
