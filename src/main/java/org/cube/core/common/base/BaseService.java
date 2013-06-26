
package org.cube.core.common.base;

import java.util.List;
import java.util.Map;

import org.cube.core.common.base.helper.Compositor;
import org.cube.core.common.base.helper.Filtration;
import org.cube.core.common.base.helper.PageData;
import org.springframework.transaction.annotation.Transactional;

/**
 * service基类.
 * 
 * @author yangzhibin
 * @param <T> 实体类类型
 */
@Transactional
public abstract class BaseService<T extends BaseEntity> {
    
    protected BaseDao<T> baseDao;
    
    public BaseDao<T> getBaseDao() {
        return this.baseDao;
    }
    
    public abstract void setBaseDao(BaseDao<T> baseDao);
    
    /**
     * 新增对象.
     */
    public void save(T entity) {
        this.getBaseDao().save(entity);
    }
    
    /**
     * 修改对象.
     */
    public void update(T entity) {
        this.getBaseDao().update(entity);
    }
    
    /**
     * 删除对象.
     */
    public void delete(T entity) {
        this.getBaseDao().delete(entity);
    }
    
    /**
     * 删除对象.
     */
    public void delete(long id) {
        this.getBaseDao().delete(id);
    }
    
    /**
     * 对象显示.
     */
    public void visible(long id) {
        this.getBaseDao().visible(id);
    }
    
    /**
     * 对象不显示.
     */
    public void unVisible(long id) {
        this.getBaseDao().unVisible(id);
    }
    
    /**
     * 获取记录总数
     */
    @Transactional(readOnly = true)
    public long count() {
        return this.getBaseDao().count();
    }
    
    /**
     * 按id获取对象.
     */
    @Transactional(readOnly = true)
    public T find(long id) {
        return this.getBaseDao().find(id);
    }
    
    /**
     * 按属性查找唯一对象,匹配方式为相等.
     */
    @Transactional(readOnly = true)
    public T find(String fieldName, Object fieldValue) {
        return this.getBaseDao().find(fieldName, fieldValue);
    }
    
    /**
     * 按属性查找对象列表,匹配方式为相等.
     */
    @Transactional(readOnly = true)
    public List<T> findList(String fieldName, Object fieldValue) {
        return this.getBaseDao().findList(fieldName, fieldValue);
    }
    
    /**
     * 按照过滤条件对象查找对象列表.
     */
    @Transactional(readOnly = true)
    public List<T> findList(Filtration... filtrations) {
        return this.getBaseDao().findList(filtrations);
    }
    
    /**
     * 按照过滤条件对象查找对象列表.
     */
    @Transactional(readOnly = true)
    public List<T> findList(List<Filtration> filtrationList) {
        return this.getBaseDao().findList(filtrationList);
    }
    
    /**
     * 按照过滤条件对象查找对象列表，支持排序.
     */
    @Transactional(readOnly = true)
    public List<T> findList(Compositor compositor, Filtration... filtrations) {
        return this.getBaseDao().findList(compositor, filtrations);
    }
    
    /**
     * 按照过滤条件对象查找对象列表，支持排序.
     */
    @Transactional(readOnly = true)
    public List<T> findList(Compositor compositor, List<Filtration> filtrationList) {
        return this.getBaseDao().findList(compositor, filtrationList);
    }
    
    /**
     * 获取全部对象.
     */
    @Transactional(readOnly = true)
    public List<T> findAll() {
        return this.getBaseDao().findAll();
    }
    
    /**
     * 获取全部对象,支持排序.
     */
    @Transactional(readOnly = true)
    public List<T> findAll(Compositor compositor) {
        return this.getBaseDao().findAll(compositor);
    }
    
    /**
     * 分页查询.
     */
    @Transactional(readOnly = true)
    public PageData<T> find(PageData<T> pageData) {
        return this.getBaseDao().find(pageData);
    }
    
    /**
     * 按id列表获取对象.
     */
    @Transactional(readOnly = true)
    public List<T> findListByIds(List<Long> idList) {
        return this.getBaseDao().findListByIds(idList);
    }
    
    // --------------------------------------------------------------------------------------------------
    
    /**
     * 按HQL查询唯一对象.
     * 
     * @param hql "from Users where name=? and password=?"
     * @param values 数量可变的参数,按顺序绑定.
     * @return
     */
    @Transactional(readOnly = true)
    public <X> X find(String hql, Object... values) {
        return this.getBaseDao().find(hql, values);
    }
    
    /**
     * 按HQL查询唯一对象.
     * 
     * @param hql "from Users where name=:name and password=:password"
     * @param values 命名参数,按名称绑定.
     * @return
     */
    @Transactional(readOnly = true)
    public <X> X find(String hql, Map<String, ?> values) {
        return this.getBaseDao().find(hql, values);
    }
    
    /**
     * 按HQL查询对象列表.
     * 
     * @param hql "from Users where name=? and password=?"
     * @param values 数量可变的参数,按顺序绑定.
     * @return
     */
    @Transactional(readOnly = true)
    public <X> List<X> findList(String hql, Object... values) {
        return this.getBaseDao().findList(hql, values);
    }
    
    /**
     * 按HQL查询对象列表.
     * 
     * @param hql "from Users where name=:name and password=:password"
     * @param values 命名参数,按名称绑定.
     * @return
     */
    @Transactional(readOnly = true)
    public <X> List<X> findList(String hql, Map<String, ?> values) {
        return this.getBaseDao().findList(hql, values);
    }
    
    /**
     * 执行HQL进行批量修改/删除操作.
     * 
     * @return 更新记录数.
     */
    public int batchExecute(String hql, Object... values) {
        return this.getBaseDao().batchExecute(hql, values);
    }
    
    /**
     * 执行HQL进行批量修改/删除操作.
     * 
     * @return 更新记录数.
     */
    public int batchExecute(String hql, Map<String, ?> values) {
        return this.getBaseDao().batchExecute(hql, values);
    }
    
    // --------------------------------------------------------------------------------------------------
    
    /**
     * 本地SQL进行修改/删除操作.
     * 
     * @return 更新记录数.
     */
    @SuppressWarnings("unchecked")
    @Transactional(readOnly = true)
    public List find(String sql) {
        return this.getBaseDao().find(sql);
    }
}
