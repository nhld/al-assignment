import { BaseSupplier } from './suppliers/base'
import { Acme } from './suppliers/acme'
import { Patagonia } from './suppliers/patagonia'
import { Paperflies } from './suppliers/paperflies'
import { IHotel } from './interfaces/interfaces'
import { HotelsService } from './hotelMerger'

const fetchHotels = async (hotelIds: string[] = [], destinationIds: string[] = []): Promise<IHotel[]> => {
  const suppliers: BaseSupplier[] = [new Acme(), new Paperflies(), new Patagonia()]

  const allSupplierData: IHotel[] = []
  for (const supplier of suppliers) {
    const supplierData = await supplier.fetch()
    allSupplierData.push(...supplierData)
  }

  const svc = new HotelsService()
  svc.mergeAndSave(allSupplierData)

  return svc.find(hotelIds, destinationIds)
}

const main = async (): Promise<void> => {
  try {
    const args = process.argv.slice(2)
    const hotelsIds = args[0]?.split(',') || ['none']
    const destinationIds = args[1]?.split(',') || ['none']
    const res = await fetchHotels(hotelsIds, destinationIds)
    console.log(JSON.stringify(res, null, 2))
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main().catch(console.error)
