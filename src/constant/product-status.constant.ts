import { ProductStatus } from 'src/app/enum/product-status.enum';

export const ProductSitutations = [
	{
		value: ProductStatus.All,
		label: 'Hepsi'
	},
	{
		value: ProductStatus.Active,
		label: 'Satışta Olanlar'
	},
	{
		value: ProductStatus.Passive,
		label: 'Satılmayanlar'
	}
]



