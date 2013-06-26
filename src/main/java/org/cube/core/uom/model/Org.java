package org.cube.core.uom.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.cube.core.common.base.BaseEntity;

/**
 * 组织实体.
 * 
 * @author macong
 */
@Entity
@Table(name = "PUB_ORG")
public class Org extends BaseEntity {
	/** 部门id */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long orgId;

	private Long parentId;

	/** 部门编码 */
	@Column(length = 20)
	private String orgCode;

	/** 部门名称 */
	@Column(length = 40)
	private String name;

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getOrgCode() {
		return orgCode;
	}

	public void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}