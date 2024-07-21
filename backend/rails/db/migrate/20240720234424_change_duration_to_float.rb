class ChangeDurationToFloat < ActiveRecord::Migration[7.1]
  def change
    change_column :songs, :duration, :float
  end
end
