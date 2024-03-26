class CreatePlayers < ActiveRecord::Migration[7.1]
  def change
    create_table :players do |t|
      t.references :user, null: false, foreign_key: true
      t.references :song, foreign_key: true
      t.datetime :started_at
      t.integer :paused_at
    end
  end
end
