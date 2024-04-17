class CreatePlaylistSongs < ActiveRecord::Migration[7.1]
  def change
    create_table :playlist_songs do |t|
      t.references :playlist, null: false, foreign_key: true
      t.references :song, null: false, foreign_key: true
      t.integer :song_index, null: false

      t.timestamps
    end
  end
end
