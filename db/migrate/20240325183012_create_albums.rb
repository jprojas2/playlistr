class CreateAlbums < ActiveRecord::Migration[7.1]
  def change
    create_table :albums do |t|
      t.string :eid
      t.references :artist, foreign_key: true
      t.string :name
      t.integer :year
      t.string :image_url

      t.timestamps
    end
  end
end
