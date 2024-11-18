import axios from 'axios'

import { IHotel } from '../interfaces/interfaces'

export abstract class BaseSupplier {
  abstract endpoint(): string

  abstract parse(data: any): IHotel

  async fetch(): Promise<IHotel[]> {
    try {
      const resp = await axios.get(this.endpoint())
      return resp.data.map((data: any) => this.parse(data))
    } catch (err) {
      console.log('Error fetching data', err)
      return []
    }
  }
}
