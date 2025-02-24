import { ChangeDetectionStrategy, Component } from '@angular/core'

import {
  CkCell,
  CkCellDef,
  CkColumnDef,
  CkFooterCell,
  CkFooterCellDef,
  CkFooterRow,
  CkFooterRowDef,
  CkHeaderCell,
  CkHeaderCellDef,
  CkHeaderRow,
  CkHeaderRowDef,
  CkRow,
  CkRowDef,
  CkTable,
} from '@corekit/ui/table'

type Person = {
  name: string
  age: number
  gender: string
  email: string
  phone: string
}

const data: Person[] = [
  {
    gender: 'female',
    name: 'Noelia Diez',
    email: 'noelia.diez@example.com',
    age: 66,
    phone: '939-882-653',
  },
  {
    gender: 'male',
    name: 'Veridiano Campos',
    email: 'veridiano.campos@example.com',
    age: 68,
    phone: '(13) 0160-9636',
  },
  {
    gender: 'male',
    name: 'Daniel Rojas',
    email: 'daniel.rojas@example.com',
    age: 69,
    phone: '909-384-431',
  },
  {
    gender: 'male',
    name: 'José Luis Esquivel',
    email: 'joseluis.esquivel@example.com',
    age: 50,
    phone: '(671) 766 4125',
  },
  {
    gender: 'female',
    name: 'Nanna Jensen',
    email: 'nanna.jensen@example.com',
    age: 37,
    phone: '53310950',
  },
  {
    gender: 'male',
    name: 'Giray Oraloğlu',
    email: 'giray.oraloglu@example.com',
    age: 64,
    phone: '(941)-435-5556',
  },
  {
    gender: 'male',
    name: 'Andre Wood',
    email: 'andre.wood@example.com',
    age: 61,
    phone: '011-963-3446',
  },
  {
    gender: 'male',
    name: 'Cyrill Lemoine',
    email: 'cyrill.lemoine@example.com',
    age: 60,
    phone: '078 330 82 82',
  },
  {
    gender: 'male',
    name: 'Emilio Carrasco',
    email: 'emilio.carrasco@example.com',
    age: 63,
    phone: '(601) 727 5877',
  },
  {
    gender: 'male',
    name: 'Dominic Chow',
    email: 'dominic.chow@example.com',
    age: 29,
    phone: 'O43 K85-9259',
  },
]

@Component({
  selector: 'app-table-page',
  standalone: true,
  imports: [
    CkTable,
    CkColumnDef,
    CkHeaderRowDef,
    CkHeaderRow,
    CkRowDef,
    CkRow,
    CkHeaderCellDef,
    CkHeaderCell,
    CkCellDef,
    CkCell,
    CkFooterRowDef,
    CkFooterRow,
    CkFooterCellDef,
    CkFooterCell,
  ],
  templateUrl: './table-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TablePageComponent {
  public displayedColumns: string[] = [
    'name',
    'email',
    'age',
    'gender',
    'phone',
  ]

  public dataSource = data
}
