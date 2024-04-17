class ChangePlayerColumns < ActiveRecord::Migration[7.1]
  def change
    remove_column :players, :song_id
    add_column :players, :playing_index, :integer, null: true
  end
end
