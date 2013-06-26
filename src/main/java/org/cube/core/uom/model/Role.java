package org.cube.core.uom.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.cube.core.common.base.BaseEntity;

/**
 * 角色.
 * 
 * @author macong
 */
@Entity
@Table(name = "PUB_ROLE")
public class Role extends BaseEntity {
	private Long roleId;
	private String roleName;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long getRoleId() {
		return roleId;
	}

	public Long setRoleId(Long roleId) {
		return this.roleId = roleId;
	}

	@Column(nullable = false, unique = true)
	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
