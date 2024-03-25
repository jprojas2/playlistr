class Player < ApplicationRecord
  belongs_to :song, optional: true
end
