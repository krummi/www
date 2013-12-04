class Tag < ActiveRecord::Base
  has_many :taggings
  has_many :blogs, through: :taggings
end
