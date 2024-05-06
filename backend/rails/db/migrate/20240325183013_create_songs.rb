class CreateSongs < ActiveRecord::Migration[7.1]
  def change
    create_table :songs do |t|
      t.string :eid, null: false
      t.string :name
      t.references :artist, foreign_key: true
      t.references :album, foreign_key: true
      t.text :lyrics
      t.integer :duration
      t.string :image_url

      t.timestamps
    end
  end
end
