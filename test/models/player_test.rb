require "test_helper"

class PlayerTest < ActiveSupport::TestCase
  test "should only be one player per user" do
    existing_player = players(:one)
    player = Player.new(user_id: existing_player.user_id)
    assert_not player.valid?
  end
end
