<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Unit;
use App\Models\Sparepart;
use App\Models\Supplier;
use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\TransactionDetail;

class ManualDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $admin = User::firstOrCreate(
                ['email' => 'admin@logistik.com'],
                ['name' => 'Admin Logistik', 'password' => bcrypt('password')]
            );

            $vendorAwal = Supplier::firstOrCreate(['name' => 'STOK OPNAME 2025'], ['address' => 'Gudang Internal', 'phone' => '-']);
            Supplier::firstOrCreate(['name' => 'Toko Sinar Harapan'], ['address' => 'Jl. Raya No. 10', 'phone' => '08123456789']);

            // Armada Bus (Model sudah fix)
            Vehicle::firstOrCreate(['nopol' => 'H 1453 AA'], ['bus_code' => 'BUS-01', 'model' => 'HINO RK8']);
            Vehicle::firstOrCreate(['nopol' => 'H 1678 BB'], ['bus_code' => 'BUS-02', 'model' => 'MERCEDES OH1626']);

            $units = [
                'PCS' => Unit::firstOrCreate(['code' => 'pcs'], ['name' => 'Pcs']),
                'SET' => Unit::firstOrCreate(['code' => 'set'], ['name' => 'Set']),
                'LTR' => Unit::firstOrCreate(['code' => 'ltr'], ['name' => 'Liter']),
            ];

            $catalog = [
                // [Kategori, Nama Barang, Merk, Satuan, Stok Awal]
                ['KAMPAS REM', 'KAMPAS REM DEPAN', 'HINO', 'PCS', 24],
                ['KAMPAS REM', 'KAMPAS REM BELAKANG', 'HINO', 'PCS', 16],
                ['FILTER', 'FILTER OLI 113', 'SAKURA', 'PCS', 10],
                ['FILTER', 'FILTER SOLAR BAWAH', 'SAKURA', 'PCS', 12],
                ['BAN', 'BAN LUAR 1000-20', 'BRIDGESTONE', 'PCS', 6],
                ['BAN', 'BAN DALAM 1000-20', 'GAJAH TUNGGAL', 'PCS', 10],
                ['ELEKTRIKAN', 'BOHLAM H4 24V', 'OSRAM', 'PCS', 50],
                ['PELUMAS', 'OLI MESIN MEDITRAN', 'PERTAMINA', 'LTR', 200],
            ];

            foreach ($catalog as $index => $item) {
                $catName    = $item[0];
                $itemName   = $item[1];
                $brandName  = $item[2];
                $unitCode   = $item[3];
                $qtyInitial = $item[4];

                $category = Category::firstOrCreate(['slug' => Str::slug($catName)], ['name' => strtoupper($catName)]);
                $brand = Brand::firstOrCreate(['slug' => Str::slug($brandName)], ['name' => strtoupper($brandName)]);

                $prefix = strtoupper(substr($catName, 0, 3));
                $no_part = $prefix . '-' . sprintf('%03d', $index + 1);

                $sparepart = Sparepart::create([
                    'category_id' => $category->id,
                    'brand_id'    => $brand->id,
                    'unit_id'     => $units[$unitCode]->id,
                    'name'        => $itemName,
                    'no_part'     => $no_part, // no_part Hasil Generator
                    'stock_min'   => 5,
                    'stock'       => 0,
                    'description' => 'Migrasi Data',
                ]);

                // Transaction Saldo Awal
                if ($qtyInitial > 0) {
                    $trx = Transaction::create([
                        'user_id' => $admin->id,
                        'supplier_id' => $vendorAwal->id,
                        'type' => 'initial',
                        'date' => now()->startOfYear(),
                        'reference_number' => 'OPNAME-' . $no_part,
                        'notes' => 'Import Saldo Awal',
                    ]);

                    TransactionDetail::create([
                        'transaction_id' => $trx->id,
                        'sparepart_id' => $sparepart->id,
                        'quantity' => $qtyInitial,
                        'price' => 0,
                    ]);

                    $sparepart->update(['stock' => $qtyInitial]);
                }
            }

            DB::commit();
            $this->command->info("Data Berhasil Diinput dengan no_part Otomatis!");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Error: " . $e->getMessage());
        }
    }
}
