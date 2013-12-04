class Blog < ActiveRecord::Base

  has_many :taggings
  has_many :tags, through: :taggings

  def self.tagged_with(name)
  	Tag.find(name: name).blogs
  end

  def tag_list
  	tags.map(&:name).join(", ")
  end

  def tag_list=(names)
  	self.tags = names.split(",").map do |t|
  		Tag.where(name: t.strip).first_or_create!
  	end
  end

end
