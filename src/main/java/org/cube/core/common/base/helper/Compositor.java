package org.cube.core.common.base.helper;

/**
 * 排序
 * @author yangzhibin
 *
 */
public class Compositor
{
	private String fieldName;
	private CompositorType compositorType;

	/**
	 * 构造方法
	 * @param fieldName 字段名称
	 * @param compositorType 排序类型
	 */
	public Compositor(String fieldName, CompositorType compositorType)
	{
		this.fieldName = fieldName;
		this.compositorType = compositorType;
	}

	/**
	 * 获取字段名称.
	 */
	public String getFieldName()
	{
		return fieldName;
	}

	/**
	 * 获取排序类型.
	 */
	public CompositorType getCompositorType()
	{
		return compositorType;
	}

	/**
	 * 排序类型.
	 */
	public enum CompositorType
	{
		ASC, //顺序
		DESC;//倒序
	}

}
