class CreatePlayerItems < ActiveRecord::Migration[7.1]
  def change
    create_table :player_items do |t|
      t.references :player, null: false, foreign_key: true
      t.references :song, null: false, foreign_key: true
      t.integer :song_index, null: false

      t.timestamps
    end
  end
end
