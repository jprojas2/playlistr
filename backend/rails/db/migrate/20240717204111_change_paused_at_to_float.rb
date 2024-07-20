class ChangePausedAtToFloat < ActiveRecord::Migration[7.1]
  def change
    change_column :players, :paused_at, :float
  end
end